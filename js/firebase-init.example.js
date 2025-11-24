// Firebase initialization example file
// Copy this file to `js/firebase-init.js` and replace the placeholder values
// with your actual Firebase project credentials. Do NOT commit real keys to Git.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
import { getAnalytics, isSupported } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js';

// Example placeholder configuration — replace with real values
const firebaseConfig = {
    apiKey: 'REPLACE_WITH_API_KEY',
    authDomain: 'REPLACE_WITH_AUTH_DOMAIN',
    projectId: 'REPLACE_WITH_PROJECT_ID',
    storageBucket: 'REPLACE_WITH_STORAGE_BUCKET',
    messagingSenderId: 'REPLACE_WITH_MESSAGING_SENDER_ID',
    appId: 'REPLACE_WITH_APP_ID',
    measurementId: 'REPLACE_WITH_MEASUREMENT_ID'
};

try {
    const app = initializeApp(firebaseConfig);
    isSupported()
        .then((supported) => {
            if (supported) {
                const analytics = getAnalytics(app);
                window.__firebaseAnalytics = analytics;
            } else {
                console.warn('[Firebase] Analytics not supported in this environment.');
            }
        })
        .catch((err) => console.warn('[Firebase] Analytics support check failed:', err));
} catch (err) {
    console.warn('[Firebase] Initialization failed:', err);
}
