import admin from "firebase-admin";

const projectId = process.env.FIREBASE_PROJECT_ID;

if (!admin.apps.length) {
  if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
    admin.initializeApp({
      credential: admin.credential.cert(JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON)),
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
  } else {
    admin.initializeApp({
      projectId,
      storageBucket: process.env.FIREBASE_STORAGE_BUCKET
    });
  }
}

export const firebaseAdmin = admin;
export const db = admin.firestore();

export function getStorageBucket() {
  if (!process.env.FIREBASE_STORAGE_BUCKET) {
    throw new Error("FIREBASE_STORAGE_BUCKET is not configured. Set it before using file upload routes.");
  }
  return admin.storage().bucket(process.env.FIREBASE_STORAGE_BUCKET);
}
