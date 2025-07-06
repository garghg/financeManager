var logo = document.getElementById('logo');
let scale = 1;
let opacity = 1;


// // Import the functions you need from the SDKs you need
// import { initializeApp } from "https://www.gstatic.com/firebasejs/11.10.0/firebase-app.js";
// // TODO: Add SDKs for Firebase products that you want to use
// // https://firebase.google.com/docs/web/setup#available-libraries

// // Your web app's Firebase configuration
// const firebaseConfig = {
// apiKey: "AIzaSyAonjfvplKrZ_ySP3WwBJVWWhFCrr_rRrA",
// authDomain: "coinquest-76a5e.firebaseapp.com",
// projectId: "coinquest-76a5e",
// storageBucket: "coinquest-76a5e.firebasestorage.app",
// messagingSenderId: "484849393520",
// appId: "1:484849393520:web:f604f1f29204359a5839b5"
// };

// // Initialize Firebase
// const app = initializeApp(firebaseConfig);



logo.addEventListener('click', () => {
    document.getElementById('begin').style.visibility = 'hidden';
    const interval = setInterval(() => {
        scale += 1;
        opacity -= 0.0055;

        logo.style.transform = `scale(${scale})`;
        logo.style.opacity = opacity;

        if (scale >= 300) {
            clearInterval(interval);
            login();
        }
    }, 10);
});

function login(){
    
}