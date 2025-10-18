// src/firebase.ts
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Configuración de Firebase
const firebaseConfig = {
  apiKey: "AIzaSyBS1eWV_FGjoaIsEpVGP05nY0CdoKqfbFg",
  authDomain: "poke-catch-88436.firebaseapp.com",
  projectId: "poke-catch-88436",
  storageBucket: "poke-catch-88436.firebasestorage.app",
  messagingSenderId: "922080178903",
  appId: "1:922080178903:web:ca9509879a1aef53613692"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Auth y el proveedor de Google
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
