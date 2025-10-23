// Fade-in animation for service cards on scroll
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
