// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCZZgOkziNBSV5UKqbOWNsC7_CAb55KP1Y",
  authDomain: "campus-buddy-ccbc3.firebaseapp.com",
  projectId: "campus-buddy-ccbc3",
  storageBucket: "campus-buddy-ccbc3.firebasestorage.app",
  messagingSenderId: "513141882285",
  appId: "1:513141882285:web:ddea7000c4f3e9e5503524",
  measurementId: "G-WENCLZK1ZH"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export { firebaseConfig };
