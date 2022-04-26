import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
    apiKey: "AIzaSyAAyVwIM36r86dRSzF5hYxxX1-Td1AiSUg",
    authDomain: "qatr-client-app.firebaseapp.com",
    databaseURL: "https://qatr-client-app-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "qatr-client-app",
    storageBucket: "qatr-client-app.appspot.com",
    messagingSenderId: "889229977870",
    appId: "1:889229977870:web:65b0482fac677280594f5f",
    measurementId: "G-K7WFW15ZGH"
  };
  

const firebaseApp = initializeApp(firebaseConfig);
const db =getFirestore();

export default db;
