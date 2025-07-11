import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
// Find needed libraries here: https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";
import { getFirestore, doc, updateDoc, setDoc, collection, getDoc, deleteDoc, addDoc} from "https://www.gstatic.com/firebasejs/11.10.0/firebase-firestore.js";


const firebaseConfig = {
  apiKey: "AIzaSyAkyVCMwmUvpSzT_FrnkhHNGvXrqvQRp8s",
  authDomain: "coinquest-d01e1.firebaseapp.com",
  projectId: "coinquest-d01e1",
  storageBucket: "coinquest-d01e1.firebasestorage.app",
  messagingSenderId: "858259555984",
  appId: "1:858259555984:web:fed3c7cdc0616962147a15"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth();

//submit button
var submit = document.getElementById('submit')
submit.addEventListener('click', async function(e){
    var username = document.getElementById('username').value;
    var allowedChars = /^[a-z0-9_.]+$/gi.test(username.value);
    if (!allowedChars) {
      alert('Invalid username. Only letters, numbers, and "_" or "." allowed.');
      return;
    }

    e.preventDefault();
    //inputs
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, password)
      .then(async (userCredential) => {
        const user = userCredential.user;
        const userId = user.uid;
        const docRef = doc(db, "budgets", userId);
        const docSnap = await getDoc(docRef);
        if (docSnap) {
          console.log(docRef.id);
          window.location.href = '../html/home.html';
        } else {
          console.log("Couldn't find the doc.");
        }
      })
      .catch((error) => {
        const errorCode = error.code;
        var errorArr = String(errorCode).split("/");
        const errorMessage = errorArr[(errorArr.length-1)].replace(/-/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
        alert(errorMessage);
    });
})