function selectPayment(el) {
    document.querySelectorAll('.payment-method').forEach((m) => m.classList.remove('active'));
    el.classList.add('active');
    const radio = el.querySelector('input[type="radio"]');
    if (radio) radio.checked = true;
}

function renderCheckout() {
    const itemsEl = document.getElementById('checkout-items');
    const summaryEl = document.getElementById('checkout-summary');
    if (!itemsEl || !summaryEl) return;

    const currency = window.currentLanguage === 'en' ? 'EGP' : 'ج.م';

    if (!cart.length) {
        itemsEl.innerHTML = `<p class="empty-cart">${t('cartEmpty')}</p>`;
        summaryEl.innerHTML = '';
        return;
    }

    itemsEl.innerHTML = cart.map((item) => `
        <div class="order-item">
            <img src="${item.image}" class="order-item-img" alt="${item.name}">
            <div class="order-item-info">
                <div class="order-item-name">${item.name}</div>
                <div class="order-item-meta">${t('quantityLabel')}: ${item.qty}</div>
            </div>
            <div class="order-item-price">${formatNumber(item.price * item.qty)} ${currency}</div>
        </div>`).join('');

    const total = getCartTotal();
    const shipping = total > 500 ? 0 : 50;
    summaryEl.innerHTML = `
        <div class="summary-row">
            <span>${t('subtotalLabel')}</span><span>${formatNumber(total)} ${currency}</span>
        </div>
        <div class="summary-row">
            <span>${t('shippingLabel')}</span><span>${shipping ? formatNumber(shipping) + ' ' + currency : t('freeShipping')}</span>
        </div>
        <div class="summary-row summary-total">
            <span>${t('totalLabel')}</span><span>${formatNumber(total + shipping)} ${currency}</span>
        </div>`;

    const btn = document.getElementById('place-order-text');
    if (btn) btn.textContent = `${t('placeOrder')} — ${formatNumber(total + shipping)} ${currency}`;
}

function placeOrder() {
    if (!cart.length) {
        showToast(t('cartEmpty'));
        return;
    }
    cart = [];
    saveToStorage('analora-cart', cart);
    updateCartCount();
    showToast(t('orderConfirmed'));
    showPage('orders-page');
}
