// Firebase initialization (module)
// Uses CDN v12.5.0 with modular SDK. Loads Analytics only if supported.

import { initializeApp } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-app.js';
import { getAnalytics, isSupported } from 'https://www.gstatic.com/firebasejs/12.5.0/firebase-analytics.js';

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: 'AIzaSyDWmK17u7MxM0bfpU-_3xxogOS0PMr5tmg',
    authDomain: 'karens-nails-art.firebaseapp.com',
    projectId: 'karens-nails-art',
    storageBucket: 'karens-nails-art.firebasestorage.app',
    messagingSenderId: '1051146588379',
    appId: '1:1051146588379:web:bb364b92666b88ee3ffcfe',
    measurementId: 'G-C4P18KLRPD'
};

try {
    const app = initializeApp(firebaseConfig);
    // Analytics is only available in certain environments (e.g., secure origins)
    isSupported()
        .then((supported) => {
            if (supported) {
                const analytics = getAnalytics(app);
                // flag for debugging
                window.__firebaseAnalytics = analytics;
            } else {
                console.warn('[Firebase] Analytics not supported in this environment.');
            }
        })
        .catch((err) => {
            console.warn('[Firebase] Analytics support check failed:', err);
        });
} catch (err) {
    console.warn('[Firebase] Initialization failed:', err);
}
