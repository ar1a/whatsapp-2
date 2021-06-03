import firebase from "firebase/app";
import "firebase/firestore";
import "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.NEXT_PUBLIC_FIREBASE_SECRET,
  authDomain: "whatsapp-2-db08a.firebaseapp.com",
  projectId: "whatsapp-2-db08a",
  storageBucket: "whatsapp-2-db08a.appspot.com",
  messagingSenderId: "181978566650",
  appId: "1:181978566650:web:a3db06ca0340b0c6a29e43",
};

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app();

const db = app.firestore();
const auth = app.auth();
const provider = new firebase.auth.GoogleAuthProvider();

export { auth, db, provider };
