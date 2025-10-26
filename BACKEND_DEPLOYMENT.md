Backend Deployment Guide

Overview

- Frontend stays on GitHub Pages (fast, free).
- Backend (PHP + MySQL) is deployed to a PHP host via GitHub Actions (FTP).
- Any push to main that changes admin/api or admin/config auto-deploys the backend.

What you need from your hosting

1. FTP server/host (e.g., ftp.yourhost.com)
2. FTP username & password
3. FTP target directory (e.g., /public_html/admin/)
4. MySQL database name, user, password, host

One-time hosting setup

1. Create the database

   - Open phpMyAdmin on your host
   - Import admin/config/schema.sql

2. Configure database.php

   - On the server, edit admin/config/database.php with your DB credentials
   - Or edit locally and commit (not recommended to commit secrets)

3. Create GitHub repo secrets
   - In GitHub: Settings → Secrets and variables → Actions → New repository secret
   - Add:
     - FTP_SERVER (e.g., ftp.yourhost.com)
     - FTP_USERNAME
     - FTP_PASSWORD
     - FTP_SERVER_DIR (e.g., /public_html/) → The workflow uploads admin/api and admin/config under this path

How deployment works

- Workflow: .github/workflows/deploy-backend.yml
- Triggers on push to main with changes under admin/api, admin/config, or assets/images
- Uploads those folders via FTP

Pointing frontend to the backend

- api-handler.js supports window.API_BASE_URL override. Add this script tag before js/api-handler.js on your pages:

  <script>
    window.API_BASE_URL = 'https://yourdomain.com/admin/api/';
  </script>

  <script src="js/api-handler.js"></script>

Cross-origin & sessions (important)

- If frontend and backend are on different domains, PHP must allow CORS and credentials.
- We’ve prepared the API endpoints to set CORS headers and support cookies.
- Ensure your backend is served over HTTPS.

Troubleshooting

- Console shows: Backend status: Using localStorage
  → API_BASE_URL not set, API unreachable, or CORS blocked
- Login doesn’t persist
  → Ensure PHP sets session cookies and CORS allows credentials; JS fetch uses credentials: 'include'
