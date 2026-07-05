import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyD5YPgmsKb1GnJuUXop0VyWyjWBQOGoP38",
  authDomain: "kivo-569a0.firebaseapp.com",
  projectId: "kivo-569a0",
  storageBucket: "kivo-569a0.firebasestorage.app",
  messagingSenderId: "516111726426",
  appId: "1:516111726426:web:164aacd20aa74b508e2563"
};

// 파이어베이스 초기화
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
