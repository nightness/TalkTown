// Give the service worker access to Firebase Messaging.
// Note that you can only use Firebase Messaging here. Other Firebase libraries
// are not available in the service worker.
importScripts('https://www.gstatic.com/firebasejs/8.6.3/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.6.3/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyAGTEJUGt-Mkp3pcy4jO9GhkqaKzyA2j7E",
    authDomain: "talktownlive.firebaseapp.com",
    projectId: "talktownlive",
    storageBucket: "talktownlive.appspot.com",
    messagingSenderId: "334341014853",
    appId: "1:334341014853:web:99f238afd756e5d15cea2c",
    measurementId: "G-LKVGRH94PF"
  });

// Retrieve an instance of Firebase Messaging so that it can handle background
// messages.
const messenging = firebase.messaging();
