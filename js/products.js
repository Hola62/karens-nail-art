// Public Products Loader

(function () {
    function formatPrice(value) {
        if (value === undefined || value === null || value === '') return '';
        // If numeric, format with currency symbol; otherwise, return as-is
        const num = Number(value);
        if (!isNaN(num)) {
            return '₦' + num.toLocaleString();
        }
        return String(value);
    }

    function buildWhatsAppLink(product) {
        const base = 'https://wa.me/2347033648510';
        const msg = `Hello Karen, I'm interested in the product: ${product.name} (${formatPrice(product.price)}). Is it available?`;
        return `${base}?text=${encodeURIComponent(msg)}`;
    }

    function renderProducts(products) {
        const grid = document.getElementById('productsGrid');
        if (!grid) return;

        if (!products || products.length === 0) {
            grid.innerHTML = '<p class="empty-state">No products available yet. Check back soon!</p>';
            return;
        }

        // Show only active products
        const active = products.filter(p => (p.status || 'active') === 'active');

        if (active.length === 0) {
            grid.innerHTML = '<p class="empty-state">No active products at the moment.</p>';
            return;
        }

        grid.innerHTML = active.map(p => `
      <div class="product-card">
        <div class="product-image-wrap">
          ${p.imageData ? `<img class=\"product-image\" src=\"${p.imageData}\" alt=\"${p.name}\">` : ''}
          ${p.badge ? `<span class=\"product-badge\">${p.badge}</span>` : ''}
        </div>
        <div class="product-content">
          <h3 class="product-title">${p.name}</h3>
          <div class="product-price">${formatPrice(p.price)}</div>
          <p class="product-desc">${p.description || ''}</p>
        </div>
        <div class="product-actions">
          <a class="btn-whatsapp" href="${buildWhatsAppLink(p)}" target="_blank" rel="noopener">Order on WhatsApp</a>
        </div>
      </div>
    `).join('');
    }

    // Featured product on home page (show only the most recent active one)
    function renderFeaturedProduct() {
        const container = document.getElementById('featuredProduct');
        if (!container) return;
        try {
            const all = JSON.parse(localStorage.getItem('nailArtProducts') || '[]');
            const active = all.filter(p => (p.status || 'active') === 'active');
            if (active.length === 0) {
                container.style.display = 'none';
                return;
            }
            active.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
            const p = active[0];
            container.innerHTML = `
                <div class="featured-card" onclick="window.location.href='products.html'">
                    <div class="product-image-wrap">
                        ${p.imageData ? `<img class=\"product-image\" src=\"${p.imageData}\" alt=\"${p.name}\">` : ''}
                        ${p.badge ? `<span class=\"product-badge\">${p.badge}</span>` : ''}
                    </div>
                    <div class="product-content">
                        <h3 class="product-title">${p.name}</h3>
                        <div class="product-price">${formatPrice(p.price)}</div>
                        ${p.description ? `<p class=\"product-desc\">${p.description}</p>` : ''}
                    </div>
                    <div class="product-actions">
                        <a class="btn" href="products.html">See all products</a>
                        <a class="btn-whatsapp" href="${buildWhatsAppLink(p)}" target="_blank" rel="noopener" onclick="event.stopPropagation()">Order on WhatsApp</a>
                    </div>
                </div>`;
        } catch (e) {
            console.error('Error rendering featured product', e);
        }
    }

    document.addEventListener('DOMContentLoaded', function () {
        try {
            const products = JSON.parse(localStorage.getItem('nailArtProducts') || '[]');
            renderProducts(products);
        } catch (e) {
            console.error('Error loading products:', e);
        }
        // In case this script is included on the home page, render featured
        renderFeaturedProduct();
    });
})();
