# Firebase (Firestore)

Este projeto pode usar o Firestore com esta estrutura:

- `users/{userId}`
- `users/{userId}/patients/{patientId}`
- `users/{userId}/consultations/{consultationId}`
- `users/{userId}/reminders/{reminderId}`
- `users/{userId}/exams/{examId}`

## 1. Instalar dependencias

```bash
npm install
npm install -D firebase-tools
```

## 2. Configurar variaveis do app web

Crie um `.env.local` baseado em `.env.example` e preencha:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_USER_ID` (opcional, fallback sem Firebase Auth)

## 3. Autenticar no Firebase CLI

```bash
npx firebase login
```

## 4. Habilitar Firebase Authentication (Email/Senha)

No Firebase Console:

- `Build` > `Authentication` > `Sign-in method`
- Ative o provedor `Email/Password`
- Em `Settings` > `Authorized domains`, adicione `jmo-jr.github.io` (ou seu dominio publicado)

## 5. Vincular projeto Firebase

```bash
npx firebase use --add
```

## 6. Publicar regras e indices

```bash
npx firebase deploy --only firestore:rules,firestore:indexes,storage
```

## 7. Popular colecoes com seed

No Firebase Console: `Project settings` > `Service accounts` > `Generate new private key`.

Opcao A: usando arquivo de service account:

```bash
FIREBASE_SERVICE_ACCOUNT_PATH="$(pwd)/secrets/firebase-service-account.json" npm run firebase:seed
```

Opcao B: usando `GOOGLE_APPLICATION_CREDENTIALS`:

```bash
export GOOGLE_APPLICATION_CREDENTIALS="$(pwd)/secrets/firebase-service-account.json"
export FIREBASE_PROJECT_ID=<seu-project-id>
npm run firebase:seed
```

Se quiser usar outro usuario raiz:

```bash
FIREBASE_USER_ID=<uid-do-medico> npm run firebase:seed
```

Importante: para o usuario logado enxergar os dados, o `FIREBASE_USER_ID` do seed precisa ser o mesmo `uid` criado no Authentication.

## Deploy no GitHub Pages (GitHub Actions)

No repositorio do GitHub, configure em `Settings` > `Secrets and variables` > `Actions`:

- `VITE_FIREBASE_API_KEY`
- `VITE_FIREBASE_AUTH_DOMAIN`
- `VITE_FIREBASE_PROJECT_ID`
- `VITE_FIREBASE_STORAGE_BUCKET`
- `VITE_FIREBASE_MESSAGING_SENDER_ID`
- `VITE_FIREBASE_APP_ID`
- `VITE_FIREBASE_USER_ID` (opcional)

## Arquivos desta pasta

- `firebase/firestore.rules`: regras de seguranca (usuario so acessa seus dados)
- `firebase/firestore.indexes.json`: indices compostos para consultas por paciente e data
- `firebase/storage.rules`: regras para upload da foto de perfil em `users/{uid}/profile/*`
- `firebase/seed-data.json`: dados iniciais baseados no mock atual do app
