// Check authentication on page load
window.addEventListener('DOMContentLoaded', function () {
    checkAuth();
    loadDashboardData();
    loadProfilePicture();
    loadTeamList();
    loadAdminGallery();
});

// Check if user is authenticated
function checkAuth() {
    const isLoggedIn = sessionStorage.getItem('adminLoggedIn');
    const adminUsername = sessionStorage.getItem('adminUsername');
    const adminName = sessionStorage.getItem('adminName');
    const adminRole = sessionStorage.getItem('adminRole');

    if (!isLoggedIn || isLoggedIn !== 'true') {
        window.location.href = 'login.html';
        return;
    }

    // Update admin name display
    const welcomeNameEl = document.getElementById('welcomeName');
    const adminNameEl = document.getElementById('adminName');
    const adminRoleEl = document.getElementById('adminRole');

    if (welcomeNameEl && (adminName || adminUsername)) {
        welcomeNameEl.textContent = adminName || adminUsername;
    }
    if (adminNameEl && (adminName || adminUsername)) {
        adminNameEl.textContent = adminName || adminUsername;
    }
    if (adminRoleEl && adminRole) {
        adminRoleEl.textContent = adminRole;
    }

    // Hide add team form if not Super Admin
    const addTeamForm = document.querySelector('.add-team-form');
    if (addTeamForm && adminRole !== 'Super Admin') {
        addTeamForm.style.display = 'none';

        // Add a message explaining why it's hidden
        const message = document.createElement('div');
        message.className = 'info-box';
        message.style.background = '#e3f2fd';
        message.style.borderLeft = '4px solid #2196f3';
        message.innerHTML = '<strong>Info:</strong> Only Super Admin (Karen) can add or remove team members.';
        addTeamForm.parentElement.insertBefore(message, addTeamForm);
    }
}

// Load saved profile picture
function loadProfilePicture() {
    // Use per-user profile picture keys so each admin can have their own
    const adminUsername = sessionStorage.getItem('adminUsername') || 'karen';
    const key = `adminProfilePic_${adminUsername}`;
    const savedProfilePic = localStorage.getItem(key) || localStorage.getItem('adminProfilePic');
    if (savedProfilePic) {
        const profilePicImg = document.getElementById('adminProfilePic');
        if (profilePicImg) {
            profilePicImg.src = savedProfilePic;
        }
    }
}

// Logout function
function logout() {
    if (confirm('Are you sure you want to logout?')) {
        sessionStorage.removeItem('adminLoggedIn');
        sessionStorage.removeItem('adminUsername');
        window.location.href = 'login.html';
    }
}

// Show specific section
function showSection(sectionName) {
    // Hide all sections
    const sections = document.querySelectorAll('.admin-section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Remove active class from all nav items
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.classList.remove('active');
    });

    // Show selected section
    const selectedSection = document.getElementById('section-' + sectionName);
    if (selectedSection) {
        selectedSection.classList.add('active');
    }

    // Add active class to clicked nav item
    const activeNav = document.querySelector(`[onclick="showSection('${sectionName}')"]`);
    if (activeNav) {
        activeNav.classList.add('active');
    }
}

// Load dashboard data
async function loadDashboardData() {
    // Get analytics data from API handler (works with both backend and localStorage)
    const analytics = await getAnalyticsForAdmin();

    if (analytics) {
        // Update stats in the dashboard
        const statsNumbers = document.querySelectorAll('.stat-number');
        if (statsNumbers.length >= 4) {
            statsNumbers[0].textContent = analytics.totalVisits || 0;
            statsNumbers[1].textContent = analytics.totalLikes || 0;
            statsNumbers[2].textContent = analytics.totalShares || 0;
            statsNumbers[3].textContent = analytics.totalInquiries || 0;
        }

        // Load recent inquiries
        loadRecentInquiries(analytics);
    }
}

// Load recent inquiries into the dashboard
function loadRecentInquiries(analytics) {
    const inquiriesList = document.querySelector('.inquiries-list');
    if (!inquiriesList) return;

    if (!analytics.inquiries || analytics.inquiries.length === 0) {
        inquiriesList.innerHTML = '<p class="empty-state">No inquiries yet. Customer messages will appear here.</p>';
        return;
    }

    inquiriesList.innerHTML = '';

    // Get the 5 most recent inquiries
    const recentInquiries = analytics.inquiries
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, 5);

    recentInquiries.forEach(inquiry => {
        const date = new Date(inquiry.timestamp);
        const timeAgo = getTimeAgo(date);

        const inquiryHTML = `
            <div class="inquiry-item">
                <div class="inquiry-header">
                    <h3>${inquiry.name}</h3>
                    <span class="inquiry-date">${timeAgo}</span>
                </div>
                <p class="inquiry-email">${inquiry.email}${inquiry.phone ? ' | ' + inquiry.phone : ''}</p>
                <p class="inquiry-message">${inquiry.message}</p>
                <div class="inquiry-actions">
                    <button class="btn-reply" onclick="replyToInquiry('${inquiry.id}')">Reply</button>
                    <button class="btn-delete" onclick="deleteInquiry('${inquiry.id}')">Delete</button>
                </div>
            </div>
        `;
        inquiriesList.innerHTML += inquiryHTML;
    });
}

// Get time ago string
function getTimeAgo(date) {
    const seconds = Math.floor((new Date() - date) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) return Math.floor(interval) + ' years ago';

    interval = seconds / 2592000;
    if (interval > 1) return Math.floor(interval) + ' months ago';

    interval = seconds / 86400;
    if (interval > 1) return Math.floor(interval) + ' days ago';

    interval = seconds / 3600;
    if (interval > 1) return Math.floor(interval) + ' hours ago';

    interval = seconds / 60;
    if (interval > 1) return Math.floor(interval) + ' minutes ago';

    return Math.floor(seconds) + ' seconds ago';
}

// Change profile picture
function changeProfilePic() {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';

    input.onchange = function (e) {
        const file = e.target.files[0];
        if (file) {
            // Check file size (max 2MB)
            if (file.size > 2 * 1024 * 1024) {
                alert('Profile picture must be less than 2MB');
                return;
            }

            const reader = new FileReader();
            reader.onload = function (event) {
                const imageData = event.target.result;

                // Update the profile picture
                document.getElementById('adminProfilePic').src = imageData;
                // Save to localStorage per-user so each admin has their own picture
                const adminUsername = sessionStorage.getItem('adminUsername') || 'karen';
                const key = `adminProfilePic_${adminUsername}`;
                localStorage.setItem(key, imageData);

                alert('Profile picture updated successfully!');
            };
            reader.readAsDataURL(file);
        }
    };

    input.click();
}

// Upload images
async function uploadImages() {
    const fileInput = document.getElementById('imageUpload');
    const gallery = document.getElementById('gallerySelect').value;
    const files = fileInput.files;

    if (files.length === 0) {
        alert('Please select at least one image to upload.');
        return;
    }

    // Validate file size and type
    for (let i = 0; i < files.length; i++) {
        const file = files[i];

        // Check file size (5MB max)
        if (file.size > 5 * 1024 * 1024) {
            alert(`File ${file.name} is too large. Maximum size is 5MB.`);
            return;
        }

        // Check file type
        if (!file.type.match('image.*')) {
            alert(`File ${file.name} is not an image.`);
            return;
        }
    }

    // In localStorage mode, save files as data URIs per-user so admins can upload when offline
    if (!API.useBackend) {
        const adminUsername = sessionStorage.getItem('adminUsername') || 'karen';
        const uploadsKey = `userUploads_${adminUsername}`;
        const existing = JSON.parse(localStorage.getItem(uploadsKey) || '[]');

        // Read files as data URIs (limit each to 2MB)
        const readPromises = [];
        for (let i = 0; i < files.length; i++) {
            const file = files[i];
            if (file.size > 2 * 1024 * 1024) {
                alert(`File ${file.name} is too large. Max 2MB.`);
                return;
            }
            readPromises.push(new Promise((resolve, reject) => {
                const reader = new FileReader();
                reader.onload = () => resolve({ name: file.name, data: reader.result, uploaded_at: new Date().toISOString(), gallery });
                reader.onerror = reject;
                reader.readAsDataURL(file);
            }));
        }

        try {
            const results = await Promise.all(readPromises);
            const combined = existing.concat(results);
            localStorage.setItem(uploadsKey, JSON.stringify(combined));
            alert('Images uploaded to local storage successfully!');
            fileInput.value = '';
            // Reload the image grid (if implemented to read per-user uploads)
            if (typeof loadImageGrid === 'function') loadImageGrid();
        } catch (err) {
            console.error('Error reading files:', err);
            alert('Error uploading images.');
        }
        return;
    }

    // Upload using API handler for backend mode
    const result = await API.uploadImages(files, gallery);

    if (result.success) {
        alert(result.message);
        // Clear the input
        fileInput.value = '';
        // Reload the image grid
        loadImageGrid();
    } else {
        alert('Error: ' + result.message);
    }
}

// Delete image
function deleteImage(imageName) {
    if (confirm(`Are you sure you want to delete ${imageName}?`)) {
        // In a real application, you would delete this from the server
        // If using localStorage, remove from per-user uploads
        if (!API.useBackend) {
            const adminUsername = sessionStorage.getItem('adminUsername') || 'karen';
            const uploadsKey = `userUploads_${adminUsername}`;
            const uploads = JSON.parse(localStorage.getItem(uploadsKey) || '[]');
            const filtered = uploads.filter(u => u.name !== imageName);
            localStorage.setItem(uploadsKey, JSON.stringify(filtered));
            alert(`Image ${imageName} deleted successfully!`);
            loadImageGrid();
            return;
        }
        alert(`Image ${imageName} deleted successfully!`);
        loadImageGrid();
    }
}

// Load image grid
function loadImageGrid() {
    const grid = document.getElementById('imageGrid');
    if (!grid) return;

    // If backend is available, the API handler will handle fetching
    if (API.useBackend) {
        grid.innerHTML = '<p>Images are managed via backend when connected.</p>';
        return;
    }

    const adminUsername = sessionStorage.getItem('adminUsername') || 'karen';
    const uploadsKey = `userUploads_${adminUsername}`;
    const uploads = JSON.parse(localStorage.getItem(uploadsKey) || '[]');

    if (!uploads || uploads.length === 0) {
        grid.innerHTML = '<p>No images uploaded yet for your account.</p>';
        return;
    }

    let html = '';
    uploads.forEach(item => {
        html += `
            <div class="image-item">
                <img src="${item.data}" alt="${item.name}">
                <div class="image-actions">
                    <button class="btn-delete" onclick="deleteImage('${item.name}')">Delete</button>
                </div>
            </div>
        `;
    });
    grid.innerHTML = html;
}

// Add team member
async function addTeamMember() {
    const name = document.getElementById('teamName').value;
    const username = document.getElementById('teamUsername').value;
    const email = document.getElementById('teamEmail').value;
    const role = document.getElementById('teamRole').value;

    // Validate inputs
    if (!name || !username || !email) {
        alert('Please fill in all fields.');
        return;
    }

    // Validate username (no spaces, alphanumeric + underscore only)
    const usernameRegex = /^[a-zA-Z0-9_]+$/;
    if (!usernameRegex.test(username)) {
        alert('Username can only contain letters, numbers, and underscores (no spaces).');
        return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email address.');
        return;
    }

    // Use the same password as super admin
    const password = 'admin123';

    // Add team member using API handler
    const result = await API.addTeamMember({
        username: username,
        full_name: name,
        email: email,
        role: role,
        password: password
    });

    if (result.success) {
        alert(`Team member ${name} added successfully!\n\nLogin credentials:\nUsername: ${username}\nPassword: admin123`);

        // Clear form
        document.getElementById('teamName').value = '';
        document.getElementById('teamUsername').value = '';
        document.getElementById('teamEmail').value = '';
        document.getElementById('teamRole').value = 'admin';

        // Reload team list
        loadTeamList();
    } else {
        alert('Error: ' + result.message);
    }
}

// Load team list
async function loadTeamList() {
    const teamListDiv = document.getElementById('teamList');

    if (!teamListDiv) {
        return; // Team list section not on page
    }

    // Check if current user is Super Admin (Karen)
    const adminRole = sessionStorage.getItem('adminRole');
    const isSuperAdmin = adminRole === 'Super Admin';

    try {
        let teamMembers = [];

        if (API.useBackend) {
            // Fetch from backend (would need an endpoint)
            // const result = await API.get('get-team-members.php');
            // teamMembers = result.members || [];
            teamListDiv.innerHTML = '<p>Team members list available when backend is connected.</p>';
        } else {
            // Get from localStorage
            teamMembers = JSON.parse(localStorage.getItem('teamMembers') || '[]');

            if (teamMembers.length === 0) {
                teamListDiv.innerHTML = '<p>No team members added yet. Add your first team member above!</p>';
            } else {
                let html = '<div class="team-members-grid">';
                teamMembers.forEach(member => {
                    const createdDate = new Date(member.created_at).toLocaleDateString();
                    html += `
                        <div class="team-member-card" data-member-id="${member.id}">
                            <div class="member-info">
                                <h4>${member.full_name}</h4>
                                <p><strong>Username:</strong> ${member.username}</p>
                                <p><strong>Email:</strong> ${member.email}</p>
                                <p><strong>Role:</strong> ${member.role}</p>
                                <p class="member-date"><small>Added: ${createdDate}</small></p>
                            </div>
                            ${isSuperAdmin ? `
                            <div class="member-actions">
                                <button class="btn-delete" onclick="deleteTeamMember(${member.id}, '${member.full_name}')">
                                    🗑️ Delete
                                </button>
                            </div>
                            ` : ''}
                        </div>
                    `;
                });
                html += '</div>';
                teamListDiv.innerHTML = html;
            }
        }
    } catch (error) {
        console.error('Error loading team list:', error);
        teamListDiv.innerHTML = '<p>Error loading team members.</p>';
    }
}

// Delete team member (Super Admin only)
async function deleteTeamMember(memberId, memberName) {
    // Double check if user is Super Admin
    const adminRole = sessionStorage.getItem('adminRole');
    if (adminRole !== 'Super Admin') {
        alert('Only Super Admin (Karen) can delete team members.');
        return;
    }

    if (!confirm(`Are you sure you want to delete ${memberName}?\n\nThis action cannot be undone.`)) {
        return;
    }

    try {
        // Use API handler to delete
        const result = await API.deleteTeamMember(memberId);

        if (result.success) {
            alert(`${memberName} has been removed from the team.`);
            // Reload the team list
            loadTeamList();
        } else {
            alert('Error: ' + result.message);
        }

    } catch (error) {
        console.error('Error deleting team member:', error);
        alert('Error deleting team member. Please try again.');
    }
}

// Save settings
function saveSettings() {
    // Get all settings values
    const phone = document.getElementById('settingsPhone').value;
    const email = document.getElementById('settingsEmail').value;
    const location = document.getElementById('settingsLocation').value;
    const tiktok = document.getElementById('settingsTikTok').value;
    const instagram = document.getElementById('settingsInstagram').value;
    const whatsapp = document.getElementById('settingsWhatsApp').value;

    // Get password fields
    const currentPassword = document.getElementById('currentPassword').value;
    const newPassword = document.getElementById('newPassword').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate password change if fields are filled
    if (currentPassword || newPassword || confirmPassword) {
        if (!currentPassword || !newPassword || !confirmPassword) {
            alert('Please fill in all password fields to change your password.');
            return;
        }

        if (newPassword !== confirmPassword) {
            alert('New password and confirm password do not match.');
            return;
        }

        if (newPassword.length < 6) {
            alert('New password must be at least 6 characters long.');
            return;
        }

        // In a real application, you would verify the current password with the server
        // For now, we'll just check if it matches the default
        if (currentPassword !== 'admin123') {
            alert('Current password is incorrect.');
            return;
        }
    }

    // In a real application, you would save these settings to the server
    alert('Settings saved successfully!');

    // Clear password fields
    document.getElementById('currentPassword').value = '';
    document.getElementById('newPassword').value = '';
    document.getElementById('confirmPassword').value = '';
}

// Preview uploaded file
document.addEventListener('DOMContentLoaded', function () {
    const fileInput = document.getElementById('imageUpload');

    if (fileInput) {
        fileInput.addEventListener('change', function (e) {
            const files = e.target.files;
            if (files.length > 0) {
                const uploadLabel = document.querySelector('.upload-label p');
                if (uploadLabel) {
                    uploadLabel.textContent = `${files.length} file(s) selected`;
                }
            }
        });
    }
});

// ====== EMAIL REPLY (via EmailJS) ======
// Open the reply modal and prefill recipient
function replyToInquiry(inquiryId) {
    try {
        const data = localStorage.getItem('karensNailArtAnalytics');
        if (!data) return alert('No inquiries data found');
        const analytics = JSON.parse(data);
        const inquiry = (analytics.inquiries || []).find(i => i.id == inquiryId);
        if (!inquiry) return alert('Inquiry not found');

        const modal = document.getElementById('replyModal');
        if (!modal) return alert('Reply modal not available');
        document.getElementById('replyToEmail').value = inquiry.email || '';
        document.getElementById('replySubject').value = `Re: Your inquiry to Karen's Nail Art`;
        const greeting = inquiry.name ? `Hi ${inquiry.name},\n\n` : 'Hi there,\n\n';
        document.getElementById('replyMessage').value = `${greeting}Thanks for reaching out.\n\n` +
            `Regarding your message: \n"${inquiry.message}"\n\n` +
            `— Karen's Nail Art`;
        modal.style.display = 'block';
        // Store current inquiry id on modal for sending
        modal.setAttribute('data-inquiry-id', inquiryId);
    } catch (e) {
        console.error(e);
        alert('Unable to open reply dialog.');
    }
}

function closeReplyModal() {
    const modal = document.getElementById('replyModal');
    if (modal) {
        modal.style.display = 'none';
        modal.removeAttribute('data-inquiry-id');
    }
}

async function sendReplyEmail() {
    const toEmail = document.getElementById('replyToEmail')?.value || '';
    const subject = document.getElementById('replySubject')?.value || '';
    const message = document.getElementById('replyMessage')?.value || '';

    console.log('Sending email to:', toEmail); // Debug log

    if (!toEmail || !toEmail.trim()) return alert('Recipient email is missing from the form');
    if (!subject.trim()) return alert('Please enter a subject');
    if (!message.trim()) return alert('Please enter a message');
    if (!window.EMAIL_SETTINGS) return alert('Email settings not configured');
    if (!window.emailjs) return alert('EmailJS library not loaded');

    const { serviceId, templateId, fromEmail, fromName } = window.EMAIL_SETTINGS;
    if (!serviceId || !templateId) return alert('EmailJS IDs are not set');

    // Disable button while sending
    const sendBtn = document.querySelector('#replyModal .actions .btn:last-child');
    const originalText = sendBtn ? sendBtn.textContent : '';
    if (sendBtn) { sendBtn.disabled = true; sendBtn.textContent = 'Sending…'; }

    // CRITICAL: EmailJS template params - your template MUST have {{to_email}} in the "To Email" field
    const templateParams = {
        to_email: toEmail,        // THIS must match your EmailJS template's "To Email" setting
        reply_to: fromEmail,      // Reply-to address
        from_name: fromName,      // Your business name
        subject: subject,         // Email subject
        message: message,         // Email body
        // Add any other fields your template uses
    };

    console.log('Template params being sent:', templateParams);
    console.log('Service ID:', serviceId, 'Template ID:', templateId);

    try {
        const res = await emailjs.send(serviceId, templateId, templateParams);
        console.log('✅ EmailJS SUCCESS:', res);
        alert('Reply sent successfully!');
        closeReplyModal();
    } catch (err) {
        console.error('❌ EmailJS ERROR:', err);
        
        // Show detailed error
        let errorMsg = 'Failed to send reply.\n\n';
        if (err.text) errorMsg += 'Error: ' + err.text + '\n';
        if (err.status) errorMsg += 'Status: ' + err.status + '\n';
        errorMsg += '\nIMPORTANT: Check your EmailJS template settings!\n';
        errorMsg += 'The "To Email" field in your template MUST be set to: {{to_email}}';
        
        alert(errorMsg);
    } finally {
        if (sendBtn) { sendBtn.disabled = false; sendBtn.textContent = originalText || 'Send Reply'; }
    }
}

// Handle inquiry deletion
function deleteInquiry(inquiryId) {
    if (confirm('Are you sure you want to delete this inquiry?')) {
        // Get analytics data
        const data = localStorage.getItem('karensNailArtAnalytics');
        if (data) {
            const analytics = JSON.parse(data);

            // Find and remove the inquiry
            analytics.inquiries = analytics.inquiries.filter(inq => inq.id != inquiryId);
            if (analytics.totalInquiries > 0) {
                analytics.totalInquiries--;
            }

            // Save updated data
            localStorage.setItem('karensNailArtAnalytics', JSON.stringify(analytics));

            // Reload the dashboard
            loadDashboardData();

            alert('Inquiry deleted successfully!');
        }
    }
}

// Edit service content
function editService(serviceName) {
    // In a real application, this would open a modal or redirect to an edit page
    alert(`Edit ${serviceName} functionality will be implemented with backend integration.`);
}

// Manage service images
function manageServiceImages(serviceName) {
    // In a real application, this would show the image management interface
    showSection('images');
}

// Add new service
function addNewService() {
    // In a real application, this would open a modal or redirect to a creation page
    alert('Add new service functionality will be implemented with backend integration.');
}

// Initialize statistics (would be loaded from backend in production)
function updateStatistics() {
    // This is where you would make an API call to get real statistics
    // For now, these are placeholder values set in the HTML
}

// Handle clicks outside dropdown menus
document.addEventListener('click', function (event) {
    // Close any open dropdowns when clicking outside
    const dropdowns = document.querySelectorAll('.dropdown-menu');
    dropdowns.forEach(dropdown => {
        if (!dropdown.contains(event.target)) {
            dropdown.classList.remove('active');
        }
    });
});

// Prevent form submission on enter key (except in textarea)
document.addEventListener('keypress', function (e) {
    if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
        const form = e.target.closest('form');
        if (form) {
            e.preventDefault();
        }
    }
});

console.log('Admin dashboard loaded successfully!');

// ===== GALLERY MANAGEMENT =====

// Load all uploaded images into gallery
function loadAdminGallery() {
    const galleryGrid = document.getElementById('adminGalleryGrid');
    if (!galleryGrid) return;

    const adminUsername = sessionStorage.getItem('adminUsername') || 'karen';
    const teamMembers = JSON.parse(localStorage.getItem('teamMembers') || '[]');
    const allUsers = ['karen', ...teamMembers.map(m => m.username)];

    const allImages = [];

    // Collect all uploads from all users
    allUsers.forEach(username => {
        const uploadsKey = `userUploads_${username}`;
        const userUploads = JSON.parse(localStorage.getItem(uploadsKey) || '[]');
        userUploads.forEach(upload => {
            allImages.push({
                ...upload,
                uploader: username,
                isMyUpload: username === adminUsername
            });
        });
    });

    // Update stats
    document.getElementById('totalImagesCount').textContent = allImages.length;
    document.getElementById('myImagesCount').textContent = allImages.filter(img => img.isMyUpload).length;

    if (allImages.length === 0) {
        galleryGrid.innerHTML = '<p class="empty-state">No images uploaded yet. Go to "Upload Images" to add some!</p>';
        return;
    }

    // Sort by upload date (newest first)
    allImages.sort((a, b) => new Date(b.uploaded_at) - new Date(a.uploaded_at));

    // Render gallery
    let html = '';
    allImages.forEach((img, index) => {
        const uploadDate = new Date(img.uploaded_at).toLocaleDateString();
        const canDelete = img.isMyUpload || sessionStorage.getItem('adminRole') === 'Super Admin';

        html += `
            <div class="gallery-image-card" data-uploader="${img.uploader}" data-gallery="${img.gallery || 'home'}">
                <img src="${img.data}" alt="${img.name}">
                <div class="gallery-image-info">
                    <p><strong>Name:</strong> ${img.name}</p>
                    <p><strong>Uploaded by:</strong> ${img.uploader}</p>
                    <p><strong>Gallery:</strong> ${img.gallery || 'home'}</p>
                    <p><strong>Date:</strong> ${uploadDate}</p>
                </div>
                <div class="gallery-image-actions">
                    <button class="btn-view" onclick="viewImageFullscreen('${img.data}', '${img.name}')">View</button>
                    ${canDelete ? `<button class="btn-delete-gallery" onclick="deleteGalleryImage('${img.uploader}', '${img.name}')">Delete</button>` : ''}
                </div>
            </div>
        `;
    });

    galleryGrid.innerHTML = html;
}

// Filter gallery images
function filterGalleryImages(filter) {
    const cards = document.querySelectorAll('.gallery-image-card');
    const adminUsername = sessionStorage.getItem('adminUsername') || 'karen';

    cards.forEach(card => {
        const uploader = card.dataset.uploader;
        const gallery = card.dataset.gallery;

        let show = false;

        if (filter === 'all') {
            show = true;
        } else if (filter === 'my-uploads') {
            show = uploader === adminUsername;
        } else {
            show = gallery === filter;
        }

        card.style.display = show ? 'block' : 'none';
    });
}

// View image in fullscreen
function viewImageFullscreen(imageData, imageName) {
    const modal = document.createElement('div');
    modal.style.cssText = 'position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.9);z-index:10000;display:flex;align-items:center;justify-content:center;padding:20px;';

    const content = document.createElement('div');
    content.style.cssText = 'max-width:90%;max-height:90%;text-align:center;';

    const img = document.createElement('img');
    img.src = imageData;
    img.alt = imageName;
    img.style.cssText = 'max-width:100%;max-height:80vh;border-radius:10px;';

    const title = document.createElement('h3');
    title.textContent = imageName;
    title.style.cssText = 'color:white;margin-top:15px;';

    const closeBtn = document.createElement('button');
    closeBtn.textContent = 'Close';
    closeBtn.style.cssText = 'margin-top:15px;padding:10px 30px;background:#f0b27a;color:#3e1f0e;border:none;border-radius:5px;font-size:1rem;cursor:pointer;';
    closeBtn.onclick = () => document.body.removeChild(modal);

    content.appendChild(img);
    content.appendChild(title);
    content.appendChild(closeBtn);
    modal.appendChild(content);

    modal.onclick = (e) => {
        if (e.target === modal) document.body.removeChild(modal);
    };

    document.body.appendChild(modal);
}

// Delete image from gallery
async function deleteGalleryImage(uploader, imageName) {
    const adminUsername = sessionStorage.getItem('adminUsername') || 'karen';
    const adminRole = sessionStorage.getItem('adminRole');

    // Check permissions
    if (uploader !== adminUsername && adminRole !== 'Super Admin') {
        alert('You can only delete your own images. Only Super Admin can delete any image.');
        return;
    }

    if (!confirm(`Are you sure you want to delete "${imageName}"?\n\nThis action cannot be undone.`)) {
        return;
    }

    try {
        const uploadsKey = `userUploads_${uploader}`;
        const uploads = JSON.parse(localStorage.getItem(uploadsKey) || '[]');
        const filtered = uploads.filter(img => img.name !== imageName);

        localStorage.setItem(uploadsKey, JSON.stringify(filtered));

        alert('Image deleted successfully!');
        loadAdminGallery();
    } catch (error) {
        console.error('Error deleting image:', error);
        alert('Error deleting image. Please try again.');
    }
}
