// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getDatabase } from "firebase/database";
import { getFirestore } from "firebase/firestore";
const firebaseConfig = {
  apiKey: "AIzaSyC4lErq3P7YaKrqZWdlW_God9Atg_GtWqk",
  authDomain: "phim-cu-dem.firebaseapp.com",
  databaseURL: "https://phim-cu-dem-default-rtdb.firebaseio.com",
  projectId: "phim-cu-dem",
  storageBucket: "phim-cu-dem.firebasestorage.app",
  messagingSenderId: "839795184262",
  appId: "1:839795184262:web:7459607b931c747d9b3707",
  measurementId: "G-GLPJDCQB56"
};

// Khởi tạo Firebase
const app = initializeApp(firebaseConfig);

// Export các service cần thiết
export const auth = getAuth(app);
export const rtdb = getDatabase(app);
export const db = getFirestore(app);
export { app };
