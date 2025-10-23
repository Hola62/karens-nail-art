# Karen's Nail Art - Backend Setup Guide

## 📋 Prerequisites

Before setting up the backend, you need:

1. **PHP 7.4 or higher** installed on your server
2. **MySQL 5.7 or higher** (or MariaDB 10.2+)
3. **Apache or Nginx** web server
4. **phpMyAdmin** (optional, for easier database management)

---

## 🚀 Installation Steps

### Step 1: Set Up Database

1. **Open phpMyAdmin** (or MySQL command line)

2. **Run the SQL schema file:**
   - Go to `admin/config/schema.sql`
   - Copy all the SQL code
   - Paste and execute it in phpMyAdmin

   **OR** via command line:

   ```bash
   mysql -u root -p < admin/config/schema.sql
   ```

3. **Database created!** You should now have:

   - Database: `karens_nails_db`
   - Default admin user:
     - Username: `karen`
     - Password: `admin123`

### Step 2: Configure Database Connection


1. **Open** `admin/config/database.php`

2. **Update the database credentials:**

   ```php
   define('DB_HOST', 'localhost');     // Usually 'localhost'
   define('DB_USER', 'your_db_user');  // Your MySQL username
   define('DB_PASS', 'your_db_pass');  // Your MySQL password
   define('DB_NAME', 'karens_nails_db');
   ```

3. **Save the file**


### Step 3: Set File Permissions

Make sure the following directories are writable:

```bash
chmod 755 admin/uploads/
chmod 755 assets/images/
```

### Step 4: Test the Backend

1. **Start your local server:**
   - **XAMPP/WAMP:** Place the project in `htdocs/` or `www/` folder
   - **Built-in PHP server:**

     ```bash
     cd c:\Users\hp\Desktop\karens-nails-art
     php -S localhost:8000
     ```

2. **Test the login API:**

   - Open browser: `http://localhost:8000/admin/login.html`
   - Login with:
     - Username: `karen`
     - Password: `admin123`

---

## 📂 Backend File Structure

```text
admin/
├── api/
│   ├── login.php              # Admin login
│   ├── logout.php             # Admin logout
│   ├── submit-inquiry.php     # Save contact form
│   ├── upload-images.php      # Upload gallery images
│   ├── get-analytics.php      # Get dashboard stats
│   ├── track-analytics.php    # Track visits/likes/shares
│   └── add-team-member.php    # Add new admin users
├── config/
│   ├── database.php           # Database connection
│   └── schema.sql             # Database structure
```

---


## 🔌 API Endpoints

### 1. **Login**

- **URL:** `/admin/api/login.php`
- **Method:** POST
- **Body:**

  ```json
  {
    "username": "karen",
    "password": "admin123"
  }
  ```

### 2. **Submit Inquiry (Contact Form)**

- **URL:** `/admin/api/submit-inquiry.php`
- **Method:** POST
- **Body:**

  ```json
  {
    "name": "John Doe",
    "email": "john@example.com",
    "phone": "+234123456789",
    "message": "I'd like to book an appointment"
  }
  ```

### 3. **Upload Images**

- **URL:** `/admin/api/upload-images.php`
- **Method:** POST (multipart/form-data)
- **Auth:** Required
- **Fields:**
  - `images[]`: Image files
  - `gallery_type`: gel-polish, acrylic-nails, nail-art, or home

### 4. **Get Analytics**

- **URL:** `/admin/api/get-analytics.php`
- **Method:** GET
- **Auth:** Required
- **Returns:** All dashboard statistics

### 5. **Track Analytics**

- **URL:** `/admin/api/track-analytics.php`
- **Method:** POST
- **Body:**

  ```json
  {
    "event_type": "visit|like|share",
    "page_name": "index",
    "image_name": "gel1.jpg"
  }
  ```

### 6. **Add Team Member**

- **URL:** `/admin/api/add-team-member.php`
- **Method:** POST
- **Auth:** Required (Super Admin only)
- **Body:**

  ```json
  {
    "username": "newuser",
    "password": "password123",
    "full_name": "Jane Doe",
    "email": "jane@example.com",
    "role": "admin"
  }
  ```

---


## 🔒 Security Features

✅ **Password Hashing** - bcrypt with PHP's `password_hash()`  
✅ **SQL Injection Protection** - Prepared statements  
✅ **Session Management** - Secure PHP sessions  
✅ **File Upload Validation** - Type and size checking  
✅ **Role-Based Access** - Super Admin, Admin, Editor  
✅ **Activity Logging** - Track all admin actions  

---

## 🗄️ Database Tables

### **admin_users**

- Admin login credentials
- User roles and permissions
- Profile pictures

### **inquiries**

- Customer contact form submissions
- Status tracking (new, read, replied, archived)

### **gallery_images**

- Uploaded images metadata
- Gallery categorization
- Upload tracking

### **analytics**

- Page visits
- Image likes
- Image shares

### **site_settings**

- Contact information
- Social media links
- Configurable settings

### **activity_log**

- Admin action history
- Security audit trail

---


## 🌐 Hosting on Live Server

### For cPanel Hosting

1. **Upload files** via FTP or File Manager
2. **Create database** in cPanel → MySQL Databases
3. **Import** `schema.sql` via phpMyAdmin
4. **Update** `admin/config/database.php` with your credentials
5. **Set permissions** for upload directories

### For Shared Hosting

Make sure your hosting supports:

- PHP 7.4+
- MySQL 5.7+
- File upload limit at least 5MB

---


## 🧪 Testing Checklist

- [ ] Database connection works
- [ ] Admin can login
- [ ] Contact form saves to database
- [ ] Images can be uploaded
- [ ] Analytics are tracked
- [ ] Team members can be added
- [ ] Activity log records actions

---

## 🆘 Troubleshooting

### Error: "Connection failed"

- Check database credentials in `database.php`
- Ensure MySQL service is running

### Error: "Failed to move file"

- Check directory permissions (755 or 777)
- Verify upload directory path exists

### Error: "Not authenticated"

- Check if sessions are enabled in PHP
- Clear browser cookies and try again

### Images not uploading

- Check PHP `upload_max_filesize` setting
- Increase to at least 10MB in `php.ini`

---

## 📧 Support

For issues or questions, check:

- PHP error logs
- MySQL error logs
- Browser console for JavaScript errors

---

## 🎉 You're All Set

Your backend is now ready. The admin panel will now:

- ✅ Store data in database (not localStorage)
- ✅ Handle real file uploads
- ✅ Track all analytics in MySQL
- ✅ Support multiple admin users
- ✅ Persist data permanently

**Default Login:**

- Username: `karen`
- Password: `admin123`

Remember to **change the password** after first login!

