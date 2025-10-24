# Security & Configuration Setup

## 🔐 Private Configuration Files

Some configuration files contain sensitive credentials and are **NOT** included in this repository for security reasons.

### Required Setup Steps

#### 1. Email Configuration (EmailJS)

**File:** `js/email-config.js`

1. Copy the template file:

   ```bash
   copy js\email-config.example.js js\email-config.js
   ```

2. Open `js/email-config.js` and replace the placeholder values:

   - `serviceId`: Your EmailJS service ID
   - `templateId`: Your EmailJS template ID
   - `publicKey`: Your EmailJS public key
   - `fromEmail`: Your business email address
   - `fromName`: Your business name

3. Get your credentials from: <https://dashboard.emailjs.com/>

#### 2. Database Configuration (Optional - if using backend)

**File:** `admin/config/config.php`

1. Copy the template file:

   ```bash
   copy admin\config\config.example.php admin\config\config.php
   ```

2. Open `admin/config/config.php` and replace:
   - `DB_HOST`: Your database host (usually `localhost`)
   - `DB_USERNAME`: Your database username
   - `DB_PASSWORD`: Your database password
   - `DB_NAME`: Your database name

### ⚠️ Important Security Notes

- **NEVER** commit files containing actual credentials to GitHub
- The `.gitignore` file is configured to exclude these sensitive files
- Keep your credentials private and secure
- Use different credentials for development and production environments

### Files Protected by .gitignore

- `js/email-config.js` - EmailJS credentials
- `admin/config/config.php` - Database credentials
- `admin/config/database.php` - Database connection
- `.env` and `.env.local` - Environment variables

### Template Files (Safe to Commit)

- `js/email-config.example.js` - EmailJS configuration template
- `admin/config/config.example.php` - Database configuration template

## 🚀 First-Time Setup Checklist

- [ ] Copy `email-config.example.js` to `email-config.js`
- [ ] Add your EmailJS credentials to `email-config.js`
- [ ] (If using backend) Copy `config.example.php` to `config.php`
- [ ] (If using backend) Add your database credentials to `config.php`
- [ ] Verify `.gitignore` is protecting your sensitive files
- [ ] Test that your site works with the new configuration

## 📝 Verifying Your Setup

To check if your sensitive files are properly ignored:

```bash
git status
```

You should **NOT** see `email-config.js` or `config.php` in the list of files to commit.

---

**Need help?** Check the main README.md for more documentation.
