// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyC7RQWicQBnqXSrsiA2ZmmqiUuMQZeLpQU",
  authDomain: "cloud-computing-app-eb57e.firebaseapp.com",
  projectId: "cloud-computing-app-eb57e",
  storageBucket: "cloud-computing-app-eb57e.firebasestorage.app",
  messagingSenderId: "157981431989",
  appId: "1:157981431989:web:cacca2f9dfeb515615c6fc"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and get a reference to the service
export const auth = getAuth(app);
export const db = getFirestore(app);
