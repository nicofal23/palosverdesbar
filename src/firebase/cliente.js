import {initializeApp} from "firebase/app"
import {getFirestore} from 'firebase/firestore'
import { getStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: "AIzaSyAMDkbwz5ADBUG3dW0kzYcPDfoLxvErq1E",
  authDomain: "palosverdes-a3ee3.firebaseapp.com",
  projectId: "palosverdes-a3ee3",
  storageBucket: "palosverdes-a3ee3.appspot.com",
  messagingSenderId: "376076202428",
  appId: "1:376076202428:web:c854a81a71d024a1e1fbb9"
  };

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);  
export const storage = getStorage(app);