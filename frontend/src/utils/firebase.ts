// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

const VITE_FB_API_KEY = import.meta.env.VITE_FB_API_KEY;
const VITE_FB_AUTH_DOMAIN = import.meta.env.VITE_FB_AUTH_DOMAIN;
const VITE_FB_PROJECTID = import.meta.env.VITE_FB_PROJECTID;
const VITE_FB_STORAGEBUCKET = import.meta.env.VITE_FB_STORAGEBUCKET;
const VITE_FB_MESSAGINGSENDERID = import.meta.env.VITE_FB_MESSAGINGSENDERID;
const VITE_FB_APPID = import.meta.env.VITE_FB_APPID;

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: VITE_FB_API_KEY,
  authDomain: VITE_FB_AUTH_DOMAIN,
  projectId: VITE_FB_PROJECTID,
  storageBucket: VITE_FB_STORAGEBUCKET,
  messagingSenderId: VITE_FB_MESSAGINGSENDERID,
  appId: VITE_FB_APPID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
