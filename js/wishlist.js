let wishlist = getFromStorage('analora-wishlist', []);

function isInWishlist(productId) {
    return wishlist.includes(productId);
}

function updateWishCount() {
    const el = document.getElementById('wish-count');
    if (el) el.textContent = wishlist.length;
}

function toggleWishlist(productId) {
    const idx = wishlist.indexOf(productId);
    if (idx >= 0) {
        wishlist.splice(idx, 1);
        showToast(t('removedFromWishlist'));
    } else {
        wishlist.push(productId);
        showToast(t('addedToWishlist'));
    }
    saveToStorage('analora-wishlist', wishlist);
    updateWishCount();
    const kpi = document.getElementById('kpi-wishlist');
    if (kpi) kpi.textContent = wishlist.length;
    if (document.getElementById('wishlist-page')?.classList.contains('active')) renderWishlist();
}

function renderWishlist() {
    const grid = document.getElementById('wishlist-grid');
    if (!grid) return;
    const items = PRODUCTS.filter((p) => wishlist.includes(p.id));
    grid.innerHTML = items.length
        ? items.map((p) => {
            const name = window.currentLanguage === 'en' ? (p.nameEn || p.name) : p.name;
            return `
            <div class="product-card">
                <img src="${p.image}" alt="${name}" onclick="showProductDetail('${p.id}')">
                <div class="product-info">
                    <div>${name}</div>
                    <div class="product-price">${formatNumber(p.price)} ${window.currentLanguage === 'en' ? 'EGP' : 'ج.م'}</div>
                    <button class="btn-add-cart" onclick="addToCart('${p.id}')">${t('addToCart')}</button>
                </div>
            </div>`;
        }).join('')
        : `<p class="empty-cart">${t('wishlistEmpty')}</p>`;
}
