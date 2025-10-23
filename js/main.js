// Show service cards immediately on mobile, use scroll animation on desktop
const isMobile = window.innerWidth <= 768;

if (isMobile) {
    // On mobile, show all cards immediately
    document.addEventListener('DOMContentLoaded', () => {
        const cards = document.querySelectorAll('.service-card');
        cards.forEach(card => {
            card.classList.add('show');
        });
    });
} else {
    // On desktop, use fade-in animation on scroll
    window.addEventListener('scroll', () => {
        const cards = document.querySelectorAll('.service-card');
        const triggerBottom = window.innerHeight * 0.9;

        cards.forEach(card => {
            const cardTop = card.getBoundingClientRect().top;

            if (cardTop < triggerBottom) {
                card.classList.add('show');
            }
        });
    });
}

// Toggle love button with tracking
function toggleLove(button) {
    const img = button.closest('.gallery-image-wrapper').querySelector('img');
    const imageName = img.src.split('/').pop();
    
    button.classList.toggle('loved');

    // Handle both span.heart and direct button content
    const heart = button.querySelector('.heart');
    
    if (button.classList.contains('loved')) {
        if (heart) {
            heart.textContent = '♥';
        } else {
            button.innerHTML = '❤️';
        }
        trackLike(imageName);
    } else {
        if (heart) {
            heart.textContent = '♡';
        } else {
            button.innerHTML = '🤍';
        }
        trackUnlike(imageName);
    }
}

// Share image with tracking
async function shareImage(button) {
    const img = button.closest('.gallery-image-wrapper').querySelector('img');
    const imageName = img.src.split('/').pop();
    const imageUrl = window.location.origin + '/' + img.src.split('/').slice(3).join('/');

    // Track the share
    trackShare(imageName);

    if (navigator.share) {
        try {
            await navigator.share({
                title: 'Karen\'s Nail Art',
                text: 'Check out this beautiful nail design from Karen\'s Nail Art!',
                url: imageUrl
            });
        } catch (err) {
            if (err.name !== 'AbortError') {
                copyToClipboard(imageUrl);
            }
        }
    } else {
        copyToClipboard(imageUrl);
    }
}

// Copy to clipboard fallback
function copyToClipboard(text) {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            alert('Link copied to clipboard!');
        });
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        alert('Link copied to clipboard!');
    }
}

// Load admin uploaded images to home page gallery
function loadAdminUploadsToGallery() {
    const galleryContainer = document.querySelector('.gallery-container');
    if (!galleryContainer) return;

    // Get all admin uploads from localStorage
    const allUploads = [];
    
    // Get uploads from all users (karen and team members)
    const teamMembers = JSON.parse(localStorage.getItem('teamMembers') || '[]');
    const allUsers = ['karen', ...teamMembers.map(m => m.username)];
    
    allUsers.forEach(username => {
        const uploadsKey = `userUploads_${username}`;
        const userUploads = JSON.parse(localStorage.getItem(uploadsKey) || '[]');
        allUploads.push(...userUploads);
    });

    // If there are admin uploads, add them to the gallery
    if (allUploads.length > 0) {
        // Get the most recent uploads (limit to 6)
        const recentUploads = allUploads.slice(-6).reverse();
        
        recentUploads.forEach(upload => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            galleryItem.innerHTML = `
                <div class="gallery-image-wrapper">
                    <img src="${upload.data}" alt="${upload.name}">
                    <div class="image-actions">
                        <button class="love-btn" onclick="toggleLove(this)">
                            <span class="heart">♡</span>
                        </button>
                        <button class="share-btn" onclick="shareImage(this)">
                            <span>⤴</span>
                        </button>
                    </div>
                </div>
                <p>${upload.name}</p>
            `;
            galleryContainer.appendChild(galleryItem);
        });
    }
}

// Load admin uploads when page loads
if (document.querySelector('.gallery-container')) {
    window.addEventListener('DOMContentLoaded', loadAdminUploadsToGallery);
}
