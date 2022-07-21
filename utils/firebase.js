import firebase from 'firebase/app';
import 'firebase/database';
import 'firebase/storage';

const firebaseConfig = {
    apiKey: 'AIzaSyCGRO708c3oi10PqYd7ICNaIjZLq-2CAZw',
    authDomain: 'nvsl-test.firebaseapp.com',
    databaseURL:
        'https://nvsl-test-default-rtdb.asia-southeast1.firebasedatabase.app',
    projectId: 'nvsl-test',
    storageBucket: 'nvsl-test.appspot.com',
    messagingSenderId: '256579692732',
    appId: '1:256579692732:web:91cb2219de1c62dcbe08b9',
    measurementId: 'G-GJ1PDTK0WS',
};

if (!firebase.apps.length) {
    try {
        firebase.initializeApp(firebaseConfig);
    } catch (err) {
        if (!/already exists/.test(err.message)) {
            console.error('Firebase initialization error', err.stack);
        }
    }
}

const fire = firebase;
export default fire;
