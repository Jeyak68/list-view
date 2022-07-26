import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getFirestore } from "firebase/firestore";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
    apiKey: "AIzaSyBkwP3e8T8LbD-FESOphdGVXaH0trzEQ00",
    authDomain: "users-fec3f.firebaseapp.com",
    projectId: "users-fec3f",
    storageBucket: "users-fec3f.appspot.com",
    messagingSenderId: "533553910219",
    appId: "1:533553910219:web:af61b0e2181b5ea290264e",
    measurementId: "G-SGSLH2N9VZ"

};
// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
const db = getFirestore(app)

export default getFirestore();


