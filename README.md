# Karen's Nails Art 💅

A professional nail salon website with admin dashboard and hybrid API system.

## 🌟 Features

### Public Pages

- **Homepage** - Service preview cards, gallery, social links
- **Services** - Complete service list with detailed pages
- **About** - Salon information
- **Contact** - Inquiry form with tracking
- **Service Details** - Gel Polish, Acrylic Nails, Nail Art
- **Interactive Features** - Like, share, visit tracking

### Admin Panel

- **Dashboard** - Real-time analytics and statistics
- **Login System** - Secure authentication
- **Image Management** - Upload and manage gallery
- **Inquiry Management** - View contact form submissions
- **Team Management** - Add/manage team members
- **Settings** - Update salon information and social media

## 🎯 Hybrid API System

This website features a **unique hybrid system** that works in two modes:

### LocalStorage Mode (Default)

- ✅ Works immediately without any setup
- ✅ All data stored in browser
- ✅ Perfect for development and testing
- ✅ No server or database required

### Backend Mode (Optional)

- ✅ Full PHP + MySQL backend
- ✅ Image uploads to server
- ✅ Team member management
- ✅ Activity logging
- ✅ Better security and scalability

**The system automatically detects which mode to use!**

## 🚀 Quick Start

### Option 1: Use Right Now (LocalStorage)

1. Open `index.html` in any browser
2. Browse the site and test features
3. Login to admin: `admin/login.html`
   - Username: `karen`
   - Password: `admin123`
4. Everything works with browser storage!

### Option 2: Add Backend (Advanced)

1. Follow instructions in `BACKEND_SETUP.md`
2. Set up PHP + MySQL server
3. Site automatically switches to backend mode!

## 📂 Project Structure

```text
karens-nails-art/
├── index.html              # Homepage
├── services.html           # Services list
├── about.html             # About page
├── contact.html           # Contact form
├── gel-polish.html        # Service detail
├── acrylic-nails.html     # Service detail
├── nail-art.html          # Service detail
├── js/
│   ├── api-handler.js     # Hybrid API system
│   ├── analytics.js       # Tracking functions
│   ├── main.js           # Like/share functions
│   └── adminAuth.js      # Admin authentication
├── css/
│   ├── style.css         # Main styles
│   └── responsive.css    # Mobile responsive
├── admin/
│   ├── login.html        # Admin login
│   ├── dashboard.html    # Admin panel
│   ├── script/
│   │   └── admin.js      # Dashboard functions
│   ├── api/              # Backend endpoints
│   │   ├── check.php
│   │   ├── login.php
│   │   ├── track-analytics.php
│   │   ├── submit-inquiry.php
│   │   ├── get-analytics.php
│   │   ├── upload-images.php
│   │   └── add-team-member.php
│   └── config/
│       ├── database.php  # DB connection
│       └── schema.sql    # DB structure
└── assets/
    ├── images/          # Site images
    └── icons/           # Icons
```

## 🔑 Admin Credentials

- **URL**: `admin/login.html`
- **Username**: `karen`
- **Password**: `admin123`
- **Role**: Super Admin

## 📊 Features by Mode

| Feature | LocalStorage | Backend |
|---------|--------------|---------|
| Page visits | ✅ | ✅ |
| Like/Share buttons | ✅ | ✅ |
| Contact form | ✅ | ✅ |
| Admin login | ✅ | ✅ (more secure) |
| Dashboard stats | ✅ | ✅ |
| Profile picture | ✅ | ✅ |
| Image uploads | ❌ | ✅ |
| Team management | ❌ | ✅ |
| Activity logs | ❌ | ✅ |

## 🛠️ Technologies

- **Frontend**: HTML5, CSS3, JavaScript (Vanilla)
- **Backend**: PHP 7.4+, MySQL 5.7+
- **Storage**: LocalStorage + MySQL (hybrid)
- **Security**: bcrypt, prepared statements, session management
- **Fonts**: Google Fonts (Poppins, Dancing Script)
- **Icons**: Custom SVG icons

## 📱 Social Media

- **TikTok**: [@eniola](https://tiktok.com/@eniola)
- **Instagram**: [@karen_wealth](https://instagram.com/karen_wealth)
- **WhatsApp**: Contact form

## 📖 Documentation

- **`STATUS.txt`** - Current system status and quick reference
- **`HYBRID_SYSTEM_GUIDE.md`** - Complete guide to hybrid API system
- **`BACKEND_SETUP.md`** - Backend installation instructions

## 🎨 Design

- **Color Scheme**:
  - Primary: #3e1f0e (Brown)
  - Accent: #f0b27a (Gold)
  - Background: #fff (White)
- **Typography**:
  - Body: Poppins
  - Headings: Dancing Script
- **Layout**: Responsive grid/flexbox

## 📝 To-Do

- [ ] Create remaining service pages (Refill & Fix, Press-on Nails, Pedicure & Manicure)
- [ ] Add email notifications for inquiries
- [ ] Add analytics charts/graphs
- [ ] Add inquiry reply functionality
- [ ] Add image deletion from gallery
- [ ] Add service content editing

## ✅ Completed

- [x] All main pages (7 pages)
- [x] Navigation with Admin button
- [x] Footer with social links
- [x] Like and share buttons with tracking
- [x] Contact form with inquiry tracking
- [x] Admin login system
- [x] Admin dashboard with all sections
- [x] Profile picture upload
- [x] Real-time analytics tracking
- [x] Complete PHP backend
- [x] Backend API endpoints
- [x] Security features
- [x] Hybrid API system

## 🤝 Credits

Built with ❤️ for Karen's Nails Art

---

**Note**: This project uses a unique hybrid architecture that works perfectly without any backend setup, but can be upgraded to full backend functionality anytime!

