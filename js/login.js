import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
// Find needed libraries here: https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, signInWithEmailAndPassword  } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

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
const auth = getAuth();

//submit button
var submit = document.getElementById('submit')
submit.addEventListener('click', function(e){
    var username = document.getElementById('username');
    // if (!username.value.includes(/^[a-z]+$/i)){                 // <------------------ verify username requirement (save it?)
    //   alert('invalid username');
    // }
    e.preventDefault();
    //inputs
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        window.location.href = '../html/home.html';
      })
      .catch((error) => {
        const errorCode = error.code;
        var errorArr = String(errorCode).split("/");
        const errorMessage = errorArr[(errorArr.length-1)].replace(/-/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
        alert(errorMessage);
    });
})