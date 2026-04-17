<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Run and deploy your AI Studio app

This contains everything you need to run your app locally.

View your app in AI Studio: https://ai.studio/apps/drive/1cJPThtguwqoAzAtsskTyPRz1S38Ii0Ir

## Run Locally

**Prerequisites:**  Node.js


1. Install dependencies:
   `npm install`
2. Copy [.env.example](.env.example) to [.env.local](.env.local) and set your keys (`GEMINI_API_KEY` + `VITE_FIREBASE_*`)
3. Run the app:
   `npm run dev`

## Firestore Setup

Para configurar colecoes, regras, indices e seed no Firebase, veja:

- [firebase/README.md](firebase/README.md)
