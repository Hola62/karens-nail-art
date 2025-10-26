// Simple toast + confirm modal utilities for public site
(function () {
    function ensureToastContainer() {
        let c = document.getElementById('toastContainer');
        if (!c) {
            c = document.createElement('div');
            c.id = 'toastContainer';
            c.className = 'toast-container';
            document.body.appendChild(c);
        }
        return c;
    }
    window.showToast = function (arg1, arg2, arg3) {
        const container = ensureToastContainer();
        let title = '', message = '', type = 'info';
        if (typeof arg3 === 'string') { title = arg1 || ''; message = arg2 || ''; type = arg3; }
        else { message = arg1 || ''; type = arg2 || 'info'; }
        const toast = document.createElement('div');
        toast.className = 'toast ' + type;
        const content = document.createElement('div'); content.style.flex = '1';
        if (title) { const t = document.createElement('div'); t.className = 'toast-title'; t.textContent = title; content.appendChild(t); }
        const m = document.createElement('div'); m.className = 'toast-message'; m.innerHTML = (message || '').replace(/\n/g, '<br>'); content.appendChild(m);
        toast.appendChild(content); container.appendChild(toast);
        setTimeout(() => { toast.style.opacity = '0'; toast.style.transition = 'opacity 200ms'; setTimeout(() => toast.remove(), 220); }, 3500);
    };

    // Lightweight confirm modal returning a Promise<boolean>
    window.showConfirm = function ({ title = 'Please confirm', message = '', confirmText = 'Yes', cancelText = 'Cancel' } = {}) {
        return new Promise(resolve => {
            const overlay = document.createElement('div');
            overlay.style.cssText = 'position:fixed;inset:0;background:rgba(0,0,0,.5);z-index:20010;display:flex;align-items:center;justify-content:center;padding:16px;';
            const box = document.createElement('div');
            box.style.cssText = 'background:#fff;color:#3e1f0e;max-width:420px;width:100%;border-radius:10px;box-shadow:0 10px 30px rgba(0,0,0,.2);overflow:hidden;';
            const hdr = document.createElement('div'); hdr.style.cssText = 'padding:14px 16px;border-bottom:1px solid #f0e6de;font-weight:700;'; hdr.textContent = title; box.appendChild(hdr);
            const body = document.createElement('div'); body.style.cssText = 'padding:14px 16px;line-height:1.5;'; body.textContent = message; box.appendChild(body);
            const actions = document.createElement('div'); actions.style.cssText = 'padding:12px 16px;display:flex;justify-content:flex-end;gap:10px;background:#f9f5f1;';
            const btnCancel = document.createElement('button'); btnCancel.textContent = cancelText; btnCancel.style.cssText = 'padding:8px 14px;border-radius:8px;border:1px solid #e0d5cc;background:#fff;color:#3e1f0e;cursor:pointer;';
            const btnOk = document.createElement('button'); btnOk.textContent = confirmText; btnOk.style.cssText = 'padding:8px 14px;border-radius:8px;border:none;background:#f0b27a;color:#3e1f0e;font-weight:700;cursor:pointer;';
            actions.appendChild(btnCancel); actions.appendChild(btnOk); box.appendChild(actions);
            overlay.appendChild(box); document.body.appendChild(overlay);
            function cleanup() { if (overlay.parentNode) overlay.parentNode.removeChild(overlay); }
            btnCancel.onclick = () => { cleanup(); resolve(false); };
            btnOk.onclick = () => { cleanup(); resolve(true); };
            overlay.addEventListener('click', (e) => { if (e.target === overlay) { cleanup(); resolve(false); } });
            document.addEventListener('keydown', function esc(e) { if (e.key === 'Escape') { document.removeEventListener('keydown', esc); cleanup(); resolve(false); } });
        });
    };
})();

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
            showToast('Link copied to clipboard!', 'success');
        });
    } else {
        const textarea = document.createElement('textarea');
        textarea.value = text;
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        showToast('Link copied to clipboard!', 'success');
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
