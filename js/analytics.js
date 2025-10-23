// Analytics and Tracking System for Karen's Nail Art
// Now uses API handler for both localStorage and backend

// Initialize analytics on page load
document.addEventListener('DOMContentLoaded', function () {
    trackPageVisit();
});

// Track page visits
function trackPageVisit() {
    const currentPage = getCurrentPage();
    API.trackVisit(currentPage);
}

// Get current page name
function getCurrentPage() {
    const path = window.location.pathname;
    const page = path.split('/').pop() || 'index.html';
    return page.replace('.html', '');
}

// Track image like
function trackLike(imageName) {
    API.trackLike(imageName);
}

// Track image unlike
function trackUnlike(imageName) {
    API.trackUnlike(imageName);
}

// Track image share
function trackShare(imageName) {
    API.trackShare(imageName);
}

// Track inquiry submission
async function trackInquiry(inquiryData) {
    return await API.submitInquiry(inquiryData);
}

// Get analytics for admin dashboard
async function getAnalyticsForAdmin() {
    return await API.getAnalytics();
}

// Export analytics data (for admin to download/view)
function exportAnalytics() {
    const analytics = getAnalytics();
    const dataStr = JSON.stringify(analytics, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });

    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'karens-nails-analytics-' + new Date().toISOString().split('T')[0] + '.json';
    link.click();

    URL.revokeObjectURL(url);
}

// Reset analytics (admin only - requires confirmation)
function resetAnalytics() {
    if (confirm('Are you sure you want to reset all analytics? This cannot be undone.')) {
        localStorage.removeItem('karensNailArtAnalytics');
        alert('Analytics have been reset.');
        window.location.reload();
    }
}

// Get popular images (most liked)
function getPopularImages(limit = 5) {
    const analytics = getAnalytics();
    const images = Object.entries(analytics.likedImages)
        .sort((a, b) => b[1] - a[1])
        .slice(0, limit);
    return images;
}

// Get recent inquiries
function getRecentInquiries(limit = 10) {
    const analytics = getAnalytics();
    return analytics.inquiries
        .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
        .slice(0, limit);
}
