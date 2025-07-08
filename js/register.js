import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
// Find needed libraries here: https://firebase.google.com/docs/web/setup#available-libraries
import { getAuth, createUserWithEmailAndPassword } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-auth.js";

// Your web app's Firebase configuration
const firebaseConfig = {
apiKey: "AIzaSyAonjfvplKrZ_ySP3WwBJVWWhFCrr_rRrA",
authDomain: "coinquest-76a5e.firebaseapp.com",
projectId: "coinquest-76a5e",
storageBucket: "coinquest-76a5e.firebasestorage.app",
messagingSenderId: "484849393520",
appId: "1:484849393520:web:f604f1f29204359a5839b5"
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
            window.location.href = './html/home.html';
        })
        .catch((error) => {
            const errorCode = error.code;
            var errorArr = String(errorCode).split("/");
            const errorMessage = errorArr[(errorArr.length-1)].replace(/-/g, " ").replace(/\b\w/g, (match) => match.toUpperCase());
            alert(errorMessage);
        });
})