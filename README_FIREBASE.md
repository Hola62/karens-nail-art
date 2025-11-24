Firebase keys removed from repository

Why
- Firebase API keys and identifiers were present in `js/firebase-init.js`. To reduce risk of accidental key exposure, the real client config has been removed from the repository.

What changed
- `js/firebase-init.js` was replaced with a safe stub that warns at runtime and does not contain secrets.
- `js/firebase-init.example.js` was added with placeholder values and the initialization code to copy.

How to re-enable Firebase locally / in deployment
1. Copy the example file to the real file path (on your local machine or deployment target):

   ```powershell
   cp js\firebase-init.example.js js\firebase-init.js
   ```

2. Edit `js/firebase-init.js` and replace the placeholder values with the values from your Firebase console.

3. DO NOT commit `js/firebase-init.js` to the repository. Instead, use one of the following safer methods:
   - Use environment variables and server-side injection at build time (recommended for production builds).
   - Use your hosting provider's secret manager (Firebase Hosting, Vercel, Netlify, etc.).

Rotate keys (recommended)
- Immediately rotate or revoke the Firebase API key shown previously in the repository via the Firebase console.
- Replace the API key with a newly generated key and update your deployment secrets.

Additional notes
- If you need help updating deployment to use environment variables instead of client-side keys, I can add a small build-time injection script or document steps for your hosting provider.
