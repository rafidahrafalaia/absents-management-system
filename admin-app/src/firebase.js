// firebase.js
import { initializeApp } from '@firebase/app';
import axios from 'axios';
import { getMessaging, getToken, onMessage } from '@firebase/messaging';

const firebaseConfig = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STROAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID
  };
  
const firebaseApp = initializeApp(firebaseConfig);
const messaging = getMessaging(firebaseApp);
const requestForToken = () => {
  return getToken(messaging, { vapidKey: process.env.REACT_APP_VAPID_KEY })
    .then((currentToken) => {
      if (currentToken) {
        console.log('current token for client: ', currentToken);
        axios.post('http://localhost:4000/api/device', {
                    name: 'admin-app',
                    fcm_token: currentToken,
                    send_notif: true
                })
                    .then(response => {
                        console.log('Token sent to server:', response.data);
                    })
                    .catch(error => {
                        console.error('Error sending token to server:', error);
                    });
        // Perform any other neccessary action with the token
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
      }
    })
    .catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
    });
};

const onMessageListener = () =>
  new Promise((resolve) => {
    onMessage(messaging, (payload) => {
      console.log("payload", payload)
      resolve(payload);
    });
  });
export { messaging, onMessageListener, requestForToken };