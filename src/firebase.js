import { initializeApp, getApps, getApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage, ref, uploadString, getDownloadURL } from 'firebase/storage';
import { getAuth } from 'firebase/auth';

export const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "AIzaSyBkmyVjSnofyWpAqGUISmwdAyOZmKhuSsw",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "souq-heba.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "souq-heba",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "souq-heba.firebasestorage.app",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "629249309572",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:629249309572:web:85fce5f90bba9e848d7bd1",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-DWZ8E8GZYL"
};

// Check if Firebase credentials are provided
export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let app = null;
let db = null;
let storage = null;
let auth = null;

if (isFirebaseConfigured) {
  try {
    app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
    db = getFirestore(app);
    storage = getStorage(app);
    auth = getAuth(app);
  } catch (error) {
    console.warn('⚠️ Firebase initialization warning:', error);
  }
}

/**
 * Upload an image (data URL base64) to Firebase Storage
 * Returns public download URL if successful, or null on fallback
 */
export const uploadImageToFirebase = async (base64Data, filename) => {
  if (!storage) return null;
  try {
    const ext = filename ? filename.split('.').pop() || 'jpg' : 'jpg';
    const fileRef = ref(storage, `products/photo_${Date.now()}_${Math.floor(1000 + Math.random() * 9000)}.${ext}`);
    await uploadString(fileRef, base64Data, 'data_url');
    const downloadURL = await getDownloadURL(fileRef);
    return downloadURL;
  } catch (err) {
    console.warn('Firebase Storage upload failed, falling back to local server:', err);
    return null;
  }
};

export { app, db, storage, auth };
export default app;
