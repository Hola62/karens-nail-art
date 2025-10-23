// API Handler - Works with both localStorage and PHP backend
// Automatically detects which system is available

const API = {
    baseUrl: '/admin/api/',
    useBackend: false,

    // Check if backend is available
    async init() {
        try {
            const response = await fetch(this.baseUrl + 'check.php');
            this.useBackend = response.ok;
            console.log('Backend status:', this.useBackend ? 'Connected' : 'Using localStorage');
        } catch (error) {
            this.useBackend = false;
            console.log('Backend not available, using localStorage');
        }
    },

    // Track page visit
    async trackVisit(pageName) {
        if (this.useBackend) {
            await this.post('track-analytics.php', {
                event_type: 'visit',
                page_name: pageName
            });
        } else {
            const analytics = this.getLocalAnalytics();
            analytics.totalVisits++;
            if (!analytics.pageVisits[pageName]) {
                analytics.pageVisits[pageName] = 0;
            }
            analytics.pageVisits[pageName]++;
            analytics.lastVisit = new Date().toISOString();
            this.saveLocalAnalytics(analytics);
        }
    },

    // Track like
    async trackLike(imageName) {
        if (this.useBackend) {
            await this.post('track-analytics.php', {
                event_type: 'like',
                image_name: imageName
            });
        } else {
            const analytics = this.getLocalAnalytics();
            if (!analytics.likedImages[imageName]) {
                analytics.likedImages[imageName] = 0;
            }
            analytics.likedImages[imageName]++;
            analytics.totalLikes++;
            this.saveLocalAnalytics(analytics);
        }
    },

    // Track unlike
    async trackUnlike(imageName) {
        if (this.useBackend) {
            // Backend will handle unlike logic
            await this.post('track-analytics.php', {
                event_type: 'unlike',
                image_name: imageName
            });
        } else {
            const analytics = this.getLocalAnalytics();
            if (analytics.likedImages[imageName] && analytics.likedImages[imageName] > 0) {
                analytics.likedImages[imageName]--;
                if (analytics.totalLikes > 0) {
                    analytics.totalLikes--;
                }
            }
            this.saveLocalAnalytics(analytics);
        }
    },

    // Track share
    async trackShare(imageName) {
        if (this.useBackend) {
            await this.post('track-analytics.php', {
                event_type: 'share',
                image_name: imageName
            });
        } else {
            const analytics = this.getLocalAnalytics();
            if (!analytics.sharedImages[imageName]) {
                analytics.sharedImages[imageName] = 0;
            }
            analytics.sharedImages[imageName]++;
            analytics.totalShares++;
            this.saveLocalAnalytics(analytics);
        }
    },

    // Submit contact inquiry
    async submitInquiry(data) {
        if (this.useBackend) {
            const response = await this.post('submit-inquiry.php', data);
            return response;
        } else {
            const analytics = this.getLocalAnalytics();
            const inquiry = {
                ...data,
                timestamp: new Date().toISOString(),
                id: Date.now()
            };
            analytics.inquiries.push(inquiry);
            analytics.totalInquiries++;
            this.saveLocalAnalytics(analytics);
            return { success: true, message: 'Thank you! Your message has been received.' };
        }
    },

    // Get analytics data
    async getAnalytics() {
        if (this.useBackend) {
            const response = await this.get('get-analytics.php');
            return response.data;
        } else {
            return this.getLocalAnalytics();
        }
    },

    // Admin login
    async login(username, password) {
        if (this.useBackend) {
            return await this.post('login.php', { username, password });
        } else {
            // Default credentials for localStorage mode
            if (username === 'karen' && password === 'admin123') {
                sessionStorage.setItem('adminLoggedIn', 'true');
                sessionStorage.setItem('adminUsername', username);
                return { success: true, message: 'Login successful' };
            } else {
                return { success: false, message: 'Invalid credentials' };
            }
        }
    },

    // Admin logout
    async logout() {
        if (this.useBackend) {
            return await this.get('logout.php');
        } else {
            sessionStorage.removeItem('adminLoggedIn');
            sessionStorage.removeItem('adminUsername');
            return { success: true, message: 'Logged out successfully' };
        }
    },

    // Upload images
    async uploadImages(files, galleryType) {
        if (this.useBackend) {
            const formData = new FormData();
            for (let i = 0; i < files.length; i++) {
                formData.append('images[]', files[i]);
            }
            formData.append('gallery_type', galleryType);

            return await this.postFormData('upload-images.php', formData);
        } else {
            // In localStorage mode, we can't actually upload files
            // Just show success message
            return {
                success: true,
                message: 'Images uploaded (localStorage mode - files not saved to server)',
                files: []
            };
        }
    },

    // Add team member
    async addTeamMember(data) {
        if (this.useBackend) {
            return await this.post('add-team-member.php', data);
        } else {
            // Save to localStorage
            try {
                const teamMembers = JSON.parse(localStorage.getItem('teamMembers') || '[]');

                // Check if username already exists
                if (teamMembers.find(member => member.username === data.username)) {
                    return {
                        success: false,
                        message: 'Username already exists'
                    };
                }

                // Check if email already exists
                if (teamMembers.find(member => member.email === data.email)) {
                    return {
                        success: false,
                        message: 'Email already exists'
                    };
                }

                // Add new team member with ID and timestamp
                const newMember = {
                    id: Date.now(),
                    username: data.username,
                    full_name: data.full_name,
                    email: data.email,
                    role: data.role || 'admin',
                    created_at: new Date().toISOString(),
                    // WARNING: Storing password in localStorage is NOT secure
                    // This is only for development/demo purposes
                    // In production, use the backend with proper password hashing
                    password: data.password
                };

                teamMembers.push(newMember);
                localStorage.setItem('teamMembers', JSON.stringify(teamMembers));

                return {
                    success: true,
                    message: `Team member ${data.full_name} added successfully! They can now login with username: ${data.username}`,
                    member: newMember
                };
            } catch (error) {
                return {
                    success: false,
                    message: 'Error saving team member: ' + error.message
                };
            }
        }
    },

    // Delete team member
    async deleteTeamMember(memberId) {
        if (this.useBackend) {
            return await this.post('delete-team-member.php', { member_id: memberId });
        } else {
            // Delete from localStorage
            try {
                const teamMembers = JSON.parse(localStorage.getItem('teamMembers') || '[]');
                const updatedMembers = teamMembers.filter(member => member.id !== memberId);

                localStorage.setItem('teamMembers', JSON.stringify(updatedMembers));

                return {
                    success: true,
                    message: 'Team member deleted successfully'
                };
            } catch (error) {
                return {
                    success: false,
                    message: 'Error deleting team member: ' + error.message
                };
            }
        }
    },

    // Helper: POST request
    async post(endpoint, data) {
        try {
            const response = await fetch(this.baseUrl + endpoint, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(data)
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, message: error.message };
        }
    },

    // Helper: POST FormData
    async postFormData(endpoint, formData) {
        try {
            const response = await fetch(this.baseUrl + endpoint, {
                method: 'POST',
                body: formData
            });
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, message: error.message };
        }
    },

    // Helper: GET request
    async get(endpoint) {
        try {
            const response = await fetch(this.baseUrl + endpoint);
            return await response.json();
        } catch (error) {
            console.error('API Error:', error);
            return { success: false, message: error.message };
        }
    },

    // Get localStorage analytics
    getLocalAnalytics() {
        const data = localStorage.getItem('karensNailArtAnalytics');
        if (data) {
            return JSON.parse(data);
        }

        // Initialize default structure
        return {
            totalVisits: 0,
            totalLikes: 0,
            totalShares: 0,
            totalInquiries: 0,
            pageVisits: {},
            likedImages: {},
            sharedImages: {},
            inquiries: [],
            firstVisit: new Date().toISOString(),
            lastVisit: new Date().toISOString()
        };
    },

    // Save localStorage analytics
    saveLocalAnalytics(analytics) {
        localStorage.setItem('karensNailArtAnalytics', JSON.stringify(analytics));
    }
};

// Initialize API on page load
API.init();

// Export for use in other scripts
window.API = API;
