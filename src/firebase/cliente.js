import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyAMDkbwz5ADBUG3dW0kzYcPDfoLxvErq1E",
  authDomain: "palosverdes-a3ee3.firebaseapp.com",
  projectId: "palosverdes-a3ee3",
  storageBucket: "palosverdes-a3ee3.appspot.com",
  messagingSenderId: "376076202428",
  appId: "1:376076202428:web:c854a81a71d024a1e1fbb9"
  };

// Inicializa la aplicación Firebase
const app = initializeApp(firebaseConfig);

// Inicializa los módulos de autenticación y Firestore
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { auth, db, storage, signInWithEmailAndPassword };