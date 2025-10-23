# Hybrid API System Guide

## Overview

Your website now has a **hybrid API system** that automatically works in two modes:

1. **Offline Mode**: Uses browser localStorage (no server needed)
2. **Online Mode**: Uses PHP backend with MySQL database (full features)

The system **automatically detects** which mode to use and switches seamlessly!

---

## How It Works

### Automatic Detection

When any page loads, the `api-handler.js` checks if the backend is available:

- If `admin/api/check.php` responds → Uses **Backend Mode** ✅
- If no response → Uses **LocalStorage Mode** 💾

### Features by Mode

| Feature              | LocalStorage Mode | Backend Mode            |
| -------------------- | ----------------- | ----------------------- |
| Page visits tracking | ✅ Yes            | ✅ Yes (MySQL)          |
| Like/Share buttons   | ✅ Yes            | ✅ Yes (MySQL)          |
| Contact form         | ✅ Yes            | ✅ Yes (MySQL)          |
| Admin login          | ✅ Yes (basic)    | ✅ Yes (secure)         |
| Dashboard stats      | ✅ Yes            | ✅ Yes (real data)      |
| Image uploads        | ❌ No             | ✅ Yes (server storage) |
| Team management      | ❌ No             | ✅ Yes (MySQL)          |
| Activity logs        | ❌ No             | ✅ Yes (audit trail)    |

---

## Current Status

### ✅ What's Working Now (Without Backend)

- All 7 pages are live and functional
- Navigation works perfectly
- Like and share buttons track in localStorage
- Contact form saves inquiries
- Admin login works with session storage
- Dashboard shows statistics from localStorage
- Profile picture saves to localStorage

### 🚀 What Works When Backend is Added

Everything above PLUS:

- All data persists in MySQL database
- Image uploads to server
- Add/manage team members
- Activity logging and audit trail
- Secure password hashing
- Better security and data integrity
- Email notifications (can be added)

---

## Testing the System

### Test LocalStorage Mode (No Setup Required)

1. Open any page in browser
2. Click like/share buttons → Check browser console: "Using localStorage mode"
3. Submit contact form → Check admin dashboard for inquiry
4. Login to admin → View statistics

### Test Backend Mode (Requires Setup)

1. Follow `BACKEND_SETUP.md` to set up PHP/MySQL
2. Open any page in browser
3. Check browser console: "Backend available, using API mode"
4. All features now use MySQL database

---

## Files Structure

### Frontend Files (Always Active)

```text
js/
  ├── api-handler.js       ← Hybrid API system (NEW!)
  ├── analytics.js         ← Uses api-handler (UPDATED!)
  ├── main.js              ← Love/share functions
  └── adminAuth.js         ← Admin authentication

admin/
  ├── dashboard.html       ← Admin panel
  ├── login.html          ← Admin login
  └── script/
      └── admin.js        ← Dashboard functions (UPDATED!)
```

### Backend Files (Optional - For Full Features)

```text
admin/
  ├── api/
  │   ├── check.php           ← Backend detection (NEW!)
  │   ├── login.php           ← Secure authentication
  │   ├── track-analytics.php ← Analytics tracking
  │   ├── submit-inquiry.php  ← Contact form handler
  │   ├── get-analytics.php   ← Dashboard data
  │   ├── upload-images.php   ← Image uploads
  │   └── add-team-member.php ← Team management
  └── config/
      ├── database.php        ← MySQL connection
      └── schema.sql         ← Database structure
```

---

## Key Functions in api-handler.js

### User-Facing Features

```javascript
API.trackVisit(page); // Track page visits
API.trackLike(itemId, page); // Track likes
API.trackUnlike(itemId); // Remove likes
API.trackShare(page); // Track shares
API.submitInquiry(data); // Contact form
```

### Admin Features

```javascript
API.login(username, pass); // Admin login
API.logout(); // Admin logout
API.getAnalytics(); // Get dashboard stats
API.uploadImages(formData); // Upload images
API.addTeamMember(userData); // Add team member
```

---

## How to Switch Modes

### Currently in LocalStorage Mode?

✅ **No action needed!** Site works perfectly.

Want to upgrade to Backend Mode?

1. Install XAMPP or web hosting with PHP/MySQL
2. Follow `BACKEND_SETUP.md` instructions
3. Refresh any page → Automatically switches to backend mode!

### Currently in Backend Mode?

Backend not responding?
✅ **No problem!** Automatically falls back to localStorage.

---

## Developer Notes

### Adding New Features

All API calls use the same pattern:

```javascript
// This works in BOTH modes automatically!
const result = await API.yourFunction(data);

if (result.success) {
  // Handle success
} else {
  // Handle error
}
```

### Checking Current Mode

```javascript
console.log(API.useBackend); // true = Backend, false = LocalStorage
```

---

## Benefits of This System

1. **Zero Setup Required** - Works immediately with localStorage
2. **Easy Testing** - Develop without server
3. **Graceful Degradation** - Never breaks if backend fails
4. **Seamless Upgrade** - Add backend anytime
5. **No Code Changes** - Same API for both modes
6. **Production Ready** - Can deploy either way

---

## Next Steps

### Option 1: Keep Using LocalStorage

✅ Perfect for personal use or small scale
✅ No hosting costs
✅ Works offline
✅ Already fully functional

### Option 2: Upgrade to Backend

🚀 Recommended for professional use
🚀 Better security
🚀 More features (uploads, team)
🚀 Database backup
🚀 Follow `BACKEND_SETUP.md`

---

## Admin Credentials

- **Username**: karen
- **Password**: admin123
- **Access**: <http://localhost/karens-nails-art/admin/login.html>

---

## Support

### Troubleshooting

**Problem**: Backend not detected

- Check if `admin/api/check.php` is accessible
- Verify PHP server is running
- Check browser console for errors

**Problem**: LocalStorage limit reached

- Browser localStorage has ~5-10MB limit
- Upgrade to backend for unlimited storage

**Problem**: Features missing

- Check which mode you're in (console.log)
- Some features only work in backend mode

---

## Summary

🎉 Your website is now **future-proof**! It works perfectly today with localStorage and can be upgraded to full backend anytime you're ready. The system automatically handles everything!
