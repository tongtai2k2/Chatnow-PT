// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import {
  getAuth,
  createUserWithEmailAndPassword,
  getReactNativePersistence,
  initializeAuth,
} from "firebase/auth";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { getFirestore, collection } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCwqYYznymJatHCTvr1skgr_dxc-qacfjw",
  authDomain: "chatnow-pt.firebaseapp.com",
  projectId: "chatnow-pt",
  storageBucket: "chatnow-pt.appspot.com",
  messagingSenderId: "652225558412",
  appId: "1:652225558412:web:5c54058bbfee3799d988a9",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
});

export const db = getFirestore(app);

export const usersRef = collection(db, "users");
export const roomRef = collection(db, "rooms");
