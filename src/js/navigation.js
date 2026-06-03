let currentProductsContext = { gender: null, category: null };
let navigationHistory = [];

function showPage(pageId) {
    document.querySelectorAll('.page').forEach((p) => p.classList.remove('active'));
    const page = document.getElementById(pageId);
    if (!page) return;
    page.classList.add('active');
    window.scrollTo(0, 0);

    const header = document.getElementById('main-header');
    const footer = document.getElementById('main-footer');
    const bottomNav = document.getElementById('bottom-nav');
    const showChrome = pageId !== 'welcome-page' && pageId !== 'selection-page';

    if (header) header.style.display = PAGES_WITH_HEADER.has(pageId) ? 'flex' : 'none';
    if (footer) footer.style.display = showChrome ? 'block' : 'none';
    if (bottomNav) bottomNav.style.display = PAGES_WITH_BOTTOM_NAV.has(pageId) ? 'flex' : 'none';

    document.querySelectorAll('.bottom-nav .nav-item').forEach((item) => {
        item.classList.toggle('active', item.dataset.page === pageId);
    });

    const searchBar = document.getElementById('search-bar');
    if (searchBar) searchBar.classList.remove('active');

    if (pageId === 'analytics-page' && typeof initAnalyticsPage === 'function') {
        initAnalyticsPage();
    }
    if (pageId === 'home-page' && typeof renderRecommendedProducts === 'function') {
        renderRecommendedProducts();
    }
    if (pageId === 'cart-page' && typeof renderCart === 'function') renderCart();
    if (pageId === 'wishlist-page' && typeof renderWishlist === 'function') renderWishlist();
}

function goBackFromProducts() {
    const { gender } = currentProductsContext;
    if (gender === 'women') showPage('women-page');
    else if (gender === 'men') showPage('men-page');
    else showPage('selection-page');
}

function logout() {
    showToast('تم تسجيل الخروج');
    showPage('welcome-page');
}
