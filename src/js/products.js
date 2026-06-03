const CATEGORY_TITLES = {
    dresses: 'فساتين', tops: 'بلوزات', bottoms: 'بناطيل',
    'shoes-bags': 'أحذية وحقائب', shirts: 'قمصان', tshirts: 'تيشيرتات',
    suits: 'بدلات', shoes: 'أحذية'
};

const CATEGORY_TITLES_EN = {
    dresses: 'Dresses', tops: 'Tops', bottoms: 'Bottoms',
    'shoes-bags': 'Shoes & Bags', shirts: 'Shirts', tshirts: 'T-Shirts',
    suits: 'Suits', shoes: 'Shoes'
};

let currentProductDetailId = null;

function getProductName(product) {
    return window.currentLanguage === 'en' ? (product.nameEn || product.name) : product.name;
}

function getCategoryLabel(category) {
    if (window.currentLanguage === 'en') {
        return CATEGORY_TITLES_EN[category] || CATEGORY_TITLES[category] || category;
    }
    return CATEGORY_TITLES[category] || category;
}

function showProducts(gender, category) {
    currentProductsContext = { gender, category };
    const grid = document.getElementById('products-grid');
    const title = document.getElementById('products-title');
    const items = PRODUCTS.filter((p) => p.gender === gender && p.category === category);

    if (title) {
        const catLabel = getCategoryLabel(category);
        title.textContent = gender === 'women'
            ? `${window.currentLanguage === 'en' ? 'Women' : 'نسائي'} — ${catLabel}`
            : `${window.currentLanguage === 'en' ? 'Men' : 'رجالي'} — ${catLabel}`;
    }
    if (grid) {
        grid.innerHTML = items.length
            ? items.map(renderProductCard).join('')
            : `<p class="empty-cart">${t('searchNoResults')}</p>`;
    }
    showPage('products-page');
}

function renderProductCard(product) {
    const inWish = isInWishlist(product.id);
    const productName = getProductName(product);
    return `
        <div class="product-card" onclick="showProductDetail('${product.id}')">
            <img src="${product.image}" alt="${productName}" loading="lazy">
            <div class="product-info">
                <div class="product-name">${productName}</div>
                <div class="product-price">${formatNumber(product.price)} ${window.currentLanguage === 'en' ? 'EGP' : 'ج.م'}</div>
                <button class="wish-btn" onclick="event.stopPropagation();toggleWishlist('${product.id}')" title="${t('wishlistButton')}">
                    <i class="${inWish ? 'fas' : 'far'} fa-heart"></i>
                </button>
            </div>
        </div>`;
}

function showProductDetail(productId) {
    currentProductDetailId = productId;
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    const container = document.getElementById('product-detail-content');
    if (!container) return;
    const productName = getProductName(product);
    const currency = window.currentLanguage === 'en' ? 'EGP' : 'ج.م';
    container.innerHTML = `
        <img src="${product.image}" alt="${productName}" style="width:100%;max-height:400px;object-fit:cover;border-radius:15px;">
        <h2 style="margin:20px 0 10px;">${productName}</h2>
        <p style="font-size:1.4rem;color:var(--main-brown);margin-bottom:20px;">${formatNumber(product.price)} ${currency}</p>
        <button class="btn-add-cart" onclick="addToCart('${product.id}')">
            <i class="fas fa-shopping-bag"></i> ${t('addToCart')}
        </button>
        <button class="btn-add-cart" style="margin-top:10px;background:transparent;color:var(--main-brown);border:2px solid var(--main-brown);"
            onclick="toggleWishlist('${product.id}')">
            <i class="fas fa-heart"></i> ${t('wishlistButton')}
        </button>`;
    showPage('product-detail-page');
}

function renderRecommendedProducts() {
    const el = document.getElementById('recommended-products');
    if (!el) return;
    el.innerHTML = PRODUCTS.slice(0, 6).map((p) => {
        const productName = getProductName(p);
        return `
        <div class="product-card" style="min-width:160px;flex-shrink:0" onclick="showProductDetail('${p.id}')">
            <img src="${p.image}" alt="${productName}" loading="lazy">
            <div class="product-info">
                <div>${productName}</div>
                <div class="product-price">${formatNumber(p.price)} ${window.currentLanguage === 'en' ? 'EGP' : 'ج.م'}</div>
            </div>
        </div>`;
    }).join('');
}
