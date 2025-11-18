// Simple menu toggle for top-right compact navigation
(function () {
    window.toggleMenu = function () {
        const dd = document.getElementById('menuDropdown');
        if (!dd) return;
        dd.classList.toggle('show');
    };

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        const dd = document.getElementById('menuDropdown');
        const btn = document.getElementById('menuButton');
        if (!dd || !btn) return;
        if (e.target === btn || btn.contains(e.target)) return;
        if (!dd.contains(e.target)) dd.classList.remove('show');
    });
})();
