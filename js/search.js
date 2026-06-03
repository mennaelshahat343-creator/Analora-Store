function toggleSearch() {
    const bar = document.getElementById('search-bar');
    if (!bar) return;
    bar.classList.toggle('active');
    if (bar.classList.contains('active')) {
        const input = document.getElementById('search-input');
        if (input) input.focus();
    }
}

function handleSearch(query) {
    const resultsEl = document.getElementById('search-results');
    if (!resultsEl) return;
    const q = (query || '').trim().toLowerCase();
    if (!q) {
        resultsEl.innerHTML = '';
        return;
    }
    const matches = PRODUCTS.filter((p) => {
        const name = window.currentLanguage === 'en' ? (p.nameEn || p.name) : p.name;
        return name.toLowerCase().includes(q);
    });
    if (!matches.length) {
        resultsEl.innerHTML = `<p style="padding:10px;color:var(--light-brown)">${t('searchNoResults')}</p>`;
        return;
    }
    resultsEl.innerHTML = matches.map((p) => {
        const label = window.currentLanguage === 'en' ? (p.nameEn || p.name) : p.name;
        return `
        <div class="search-result-item" style="padding:10px;cursor:pointer;border-bottom:1px solid var(--border-color)"
            onclick="showProducts('${p.gender}','${p.category}');toggleSearch();">
            ${label} — ${formatNumber(p.price)} ${window.currentLanguage === 'en' ? 'EGP' : 'ج.م'}
        </div>`;
    }).join('');
}
