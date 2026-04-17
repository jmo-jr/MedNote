import fs from "node:fs/promises";
import path from "node:path";
import process from "node:process";
import { fileURLToPath } from "node:url";
import { applicationDefault, cert, initializeApp } from "firebase-admin/app";
import { FieldValue, getFirestore } from "firebase-admin/firestore";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const projectRoot = path.resolve(__dirname, "..");

const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
const seedPath = process.env.FIREBASE_SEED_PATH || path.resolve(projectRoot, "firebase", "seed-data.json");

const bootstrap = async () => {
  let appConfig = {};

  if (serviceAccountPath) {
    const rawServiceAccount = await fs.readFile(serviceAccountPath, "utf8");
    const serviceAccount = JSON.parse(rawServiceAccount);
    appConfig = {
      credential: cert(serviceAccount),
      projectId: serviceAccount.project_id,
    };
  } else {
    appConfig = {
      credential: applicationDefault(),
      projectId: process.env.FIREBASE_PROJECT_ID,
    };
  }

  initializeApp(appConfig);
  const db = getFirestore();

  const rawSeed = await fs.readFile(seedPath, "utf8");
  const seedData = JSON.parse(rawSeed);
  const selectedUserId = process.env.FIREBASE_USER_ID || seedData.user?.id;

  if (!selectedUserId) {
    throw new Error("FIREBASE_USER_ID nao definido e seed-data sem user.id.");
  }

  const userRef = db.collection("users").doc(selectedUserId);
  await userRef.set(
    {
      ...seedData.user,
      id: selectedUserId,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true }
  );

  const collections = ["patients", "consultations", "reminders", "exams"];

  for (const collectionName of collections) {
    const docs = Array.isArray(seedData[collectionName]) ? seedData[collectionName] : [];
    if (docs.length === 0) {
      continue;
    }

    for (let i = 0; i < docs.length; i += 400) {
      const chunk = docs.slice(i, i + 400);
      const batch = db.batch();

      for (const doc of chunk) {
        if (!doc.id) {
          throw new Error(`Documento sem id em ${collectionName}.`);
        }

        const ref = userRef.collection(collectionName).doc(doc.id);
        batch.set(
          ref,
          {
            ...doc,
            updatedAt: FieldValue.serverTimestamp(),
          },
          { merge: true }
        );
      }

      await batch.commit();
    }

    console.log(`${collectionName}: ${docs.length} documentos gravados`);
  }

  console.log(`Seed concluido para users/${selectedUserId}`);
};

bootstrap().catch((error) => {
  console.error(error);
  process.exit(1);
});
