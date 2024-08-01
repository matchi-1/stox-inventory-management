import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore"

const firebaseConfig = {
  apiKey: "AIzaSyDGZjsO3OL7m0WyxYMNGqMc3D8oylABHog",
  authDomain: "stox-b3957.firebaseapp.com",
  projectId: "stox-b3957",
  storageBucket: "stox-b3957.appspot.com",
  messagingSenderId: "1012204402903",
  appId: "1:1012204402903:web:55157a44362b9638ff5892",
  measurementId: "G-5D09WC0FFV"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const firestore = getFirestore(app);

export { firestore };
