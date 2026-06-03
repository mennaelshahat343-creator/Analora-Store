let cart = getFromStorage('analora-cart', []);

function updateCartCount() {
    const el = document.getElementById('cart-count');
    const total = cart.reduce((s, i) => s + i.qty, 0);
    if (el) el.textContent = total;
}

function addToCart(productId) {
    const product = PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    const existing = cart.find((i) => i.id === productId);
    if (existing) existing.qty += 1;
    else cart.push({ id: product.id, name: product.name, price: product.price, image: product.image, qty: 1 });
    saveToStorage('analora-cart', cart);
    updateCartCount();
    showToast(t('addedToCartToast'));
}

function removeFromCart(productId) {
    cart = cart.filter((i) => i.id !== productId);
    saveToStorage('analora-cart', cart);
    updateCartCount();
    renderCart();
}

function changeQty(productId, delta) {
    const item = cart.find((i) => i.id === productId);
    if (!item) return;
    item.qty += delta;
    if (item.qty <= 0) removeFromCart(productId);
    else {
        saveToStorage('analora-cart', cart);
        updateCartCount();
        renderCart();
    }
}

function getCartTotal() {
    return cart.reduce((s, i) => s + i.price * i.qty, 0);
}

function renderCart() {
    const container = document.getElementById('cart-container');
    if (!container) return;
    if (!cart.length) {
        container.innerHTML = `<p class="empty-cart">${t('cartEmpty')}</p>`;
        return;
    }
    const total = getCartTotal();
    const currency = window.currentLanguage === 'en' ? 'EGP' : 'ج.م';
    container.innerHTML = cart.map((item) => `
        <div class="cart-item">
            <img src="${item.image}" alt="${item.name}" style="width:70px;height:70px;object-fit:cover;border-radius:10px;">
            <div style="flex:1">
                <div style="font-weight:600">${item.name}</div>
                <div style="color:var(--light-brown)">${formatNumber(item.price)} ${currency}</div>
                <div style="margin-top:8px;display:flex;align-items:center;gap:10px;">
                    <button onclick="changeQty('${item.id}',-1)">−</button>
                    <span>${item.qty}</span>
                    <button onclick="changeQty('${item.id}',1)">+</button>
                </div>
            </div>
            <button onclick="removeFromCart('${item.id}')" style="background:none;border:none;color:var(--error-color);cursor:pointer">
                <i class="fas fa-trash"></i>
            </button>
        </div>`).join('') + `
        <div style="margin-top:20px;text-align:center">
            <p style="font-size:1.2rem;margin-bottom:15px">${t('totalLabel')}: <strong>${formatNumber(total)} ${currency}</strong></p>
            <button class="btn-main" onclick="showPage('checkout-page');renderCheckout()">${t('placeOrder')}</button>
        </div>`;
}
