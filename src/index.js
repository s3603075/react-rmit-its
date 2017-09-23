import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import firebase from 'firebase';
import {BrowserRouter} from "react-router-dom";

const config = {
    apiKey: "AIzaSyDaT-A208XALPjEegzPB7WoZl5NPR5dPiE",
    authDomain: "rmit-its.firebaseapp.com",
    databaseURL: "https://rmit-its.firebaseio.com",
    projectId: "rmit-its",
    storageBucket: "rmit-its.appspot.com",
    messagingSenderId: "883266328240"
};
firebase.initializeApp(config);

ReactDOM.render(
    <BrowserRouter>
        <App />
    </BrowserRouter>
, document.getElementById('root'));
registerServiceWorker();

