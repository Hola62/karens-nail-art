// Accessible menu toggle with keyboard navigation and mobile drawer behavior
(function () {
    const menuBtn = document.getElementById('menuButton');
    const menuDropdown = document.getElementById('menuDropdown');
    const menuOverlay = document.getElementById('menuOverlay');
    const menuClose = document.getElementById('menuClose');

    if (!menuBtn || !menuDropdown) {
        // expose a safe toggle for legacy inline onclicks
        window.toggleMenu = function () { return; };
        return;
    }

    // Expose for any existing inline calls
    window.toggleMenu = toggleMenu;

    // Helper: show/hide
    function openMenu() {
        // Determine drawer mode first so CSS transitions can animate properly
        const isSmall = window.matchMedia('(max-width: 640px)').matches;
        if (isSmall) menuDropdown.classList.add('drawer');
        else menuDropdown.classList.remove('drawer');

        // Show overlay when menu opens
        if (menuOverlay) {
            menuOverlay.classList.add('show');
            menuOverlay.setAttribute('aria-hidden', 'false');
        }

        // Prevent body scroll on small screens while drawer is open
        if (isSmall) document.body.style.overflow = 'hidden';

        // Add the visible state on the next frame so transitions run
        requestAnimationFrame(() => {
            menuDropdown.classList.add('show');
            menuDropdown.setAttribute('aria-hidden', 'false');
            menuBtn.setAttribute('aria-expanded', 'true');

            // Focus first focusable item inside the menu
            const first = menuDropdown.querySelector('a, button, [tabindex]:not([tabindex="-1"])');
            if (first) first.focus();
        });
    }

    function closeMenu(focusButton = true) {
        menuDropdown.classList.remove('show');
        menuDropdown.classList.remove('drawer');
        menuDropdown.setAttribute('aria-hidden', 'true');
        menuBtn.setAttribute('aria-expanded', 'false');
        if (menuOverlay) {
            menuOverlay.classList.remove('show');
            menuOverlay.setAttribute('aria-hidden', 'true');
        }

        // Restore body scroll
        document.body.style.overflow = '';
        if (focusButton) menuBtn.focus();
    }

    function toggleMenu() {
        if (menuDropdown.classList.contains('show')) closeMenu();
        else openMenu();
    }

    // Click on button toggles menu
    menuBtn.addEventListener('click', function (e) {
        e.stopPropagation();
        toggleMenu();
    });

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        if (e.target === menuBtn || menuBtn.contains(e.target)) return;
        if (!menuDropdown.contains(e.target)) closeMenu(false);
    });

    // Close when overlay is clicked (if present)
    if (menuOverlay) {
        menuOverlay.addEventListener('click', function () { closeMenu(false); });
    }

    // Close button inside menu (mobile drawer)
    if (menuClose) {
        menuClose.addEventListener('click', function (e) { e.stopPropagation(); closeMenu(); });
    }

    // Keyboard interactions
    menuBtn.addEventListener('keydown', function (e) {
        // Open on Space/Enter, allow DownArrow to open and focus first item
        if (e.key === 'Enter' || e.key === ' ' || e.key === 'Spacebar') {
            e.preventDefault();
            openMenu();
        } else if (e.key === 'ArrowDown') {
            e.preventDefault();
            openMenu();
        }
    });

    menuDropdown.addEventListener('keydown', function (e) {
        const focusable = Array.from(menuDropdown.querySelectorAll('a, button, [tabindex]:not([tabindex="-1"])')).filter(el => !el.hasAttribute('disabled'));
        if (!focusable.length) return;
        const current = document.activeElement;
        const idx = focusable.indexOf(current);

        if (e.key === 'Escape') {
            e.preventDefault();
            closeMenu();
            return;
        }

        if (e.key === 'ArrowDown') {
            e.preventDefault();
            const next = focusable[(idx + 1) % focusable.length];
            if (next) next.focus();
            return;
        }

        if (e.key === 'ArrowUp') {
            e.preventDefault();
            const prev = focusable[(idx - 1 + focusable.length) % focusable.length];
            if (prev) prev.focus();
            return;
        }

        // Trap tabbing inside the menu when open (especially in drawer mode)
        if (e.key === 'Tab') {
            if (e.shiftKey) {
                // If on the first focusable item, move to the last
                if (idx === 0) {
                    e.preventDefault();
                    focusable[focusable.length - 1].focus();
                }
            } else {
                // If on the last focusable item, move to the first
                if (idx === focusable.length - 1) {
                    e.preventDefault();
                    focusable[0].focus();
                }
            }
        }
    });

    // Adjust drawer behavior when resizing
    window.addEventListener('resize', function () {
        if (!menuDropdown.classList.contains('show')) return;
        if (window.matchMedia('(max-width: 640px)').matches) menuDropdown.classList.add('drawer');
        else menuDropdown.classList.remove('drawer');
    });
})();
