import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCLHvYRWvTdI1z2_4Kk0aSN6MEw4QeFix0",
  authDomain: "taskly-32c9e.firebaseapp.com",
  projectId: "taskly-32c9e",
  storageBucket: "taskly-32c9e.firebasestorage.app",
  messagingSenderId: "758420632219",
  appId: "1:758420632219:web:639652567ef2d64eb28c3e"
};

const app = initializeApp(firebaseConfig);
export const db = getFirestore(app);
