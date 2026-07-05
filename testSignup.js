import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyD5YPgmsKb1GnJuUXop0VyWyjWBQOGoP38",
  authDomain: "kivo-569a0.firebaseapp.com",
  projectId: "kivo-569a0",
  storageBucket: "kivo-569a0.firebasestorage.app",
  messagingSenderId: "516111726426",
  appId: "1:516111726426:web:164aacd20aa74b508e2563"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

async function testSignup() {
  const testId = "qatest_db_1";
  try {
    const virtualEmail = `${testId}@kivo.com`;
    const userCredential = await createUserWithEmailAndPassword(auth, virtualEmail, "password123!");
    console.log("Auth created:", userCredential.user.uid);
    
    await setDoc(doc(db, 'users', testId), {
      id: testId,
      name: "Test Name",
      phone: "010-0000-0000",
      email: "test@example.com",
      profileUrl: null,
      marketing: "N",
      date: "2026-07-06",
      status: '활성'
    });
    
    console.log("Firestore doc created!");
    process.exit(0);
  } catch (error) {
    console.error("Signup Error:", error.code, error.message);
    process.exit(1);
  }
}

testSignup();
