import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getStorage } from "firebase/storage";
import { getDatabase } from "firebase/database";

const firebaseConfig = {
  apiKey: "AIzaSyA5pK2ZRL0ti-WQNTILgmbvOWWTdmPiYGw",
  authDomain: "vocal-sentiment-analysis.firebaseapp.com",
  projectId: "vocal-sentiment-analysis",
  storageBucket: "vocal-sentiment-analysis.appspot.com",
  messagingSenderId: "1075108475491",
  appId: "1:1075108475491:web:f446640855714ba438fe56",
};

const app = initializeApp(firebaseConfig);
const storage = getStorage(app);

const auth = getAuth(app);
const database = getDatabase(app);

export { auth, storage, database };
