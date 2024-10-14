// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCFBzS_fYBI3GRf_hdYR0acBfx-O5Tre7w",
  authDomain: "bleeding-heart-art-space.firebaseapp.com",
  projectId: "bleeding-heart-art-space",
  storageBucket: "bleeding-heart-art-space.appspot.com",
  messagingSenderId: "336575275214",
  appId: "1:336575275214:web:76cb33dd6e3f711336309f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);