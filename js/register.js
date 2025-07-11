import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
// Find needed libraries here: https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Your web app's Firebase configuration
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
    e.preventDefault();
    //inputs
    var email = document.getElementById("email").value;
    var password = document.getElementById("password").value;
    var username = document.getElementById("username").value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((userCredential) => {
            const user = userCredential.user;
            sessionStorage.setItem('register', true);
            window.location.href = './html/home.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            var errorArr = String(errorCode).split("/");
            const errorMessage = errorArr[(errorArr.length-1)].replace(/-/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
            alert(errorMessage);
        });
})