/** كتالوج المنتجات + دوال تحليل الداتا سيت */
const PRODUCTS = [
    { id: 'w1', gender: 'women', category: 'dresses', name: 'فستان سهرة أنيق', nameEn: 'Elegant Evening Dress', price: 1299, image: 'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=500&fit=crop' },
    { id: 'w2', gender: 'women', category: 'dresses', name: 'فستان صيفي زهري', nameEn: 'Pink Summer Dress', price: 899, image: 'https://images.unsplash.com/photo-1572804013309-59a88b7e92d1?w=400&h=500&fit=crop' },
    { id: 'w3', gender: 'women', category: 'tops', name: 'بلوزة حرير بيضاء', nameEn: 'White Silk Blouse', price: 449, image: 'https://images.unsplash.com/photo-1564257631407-4deb1f99d992?w=400&h=500&fit=crop' },
    { id: 'w4', gender: 'women', category: 'tops', name: 'بلوزة كاجوال', nameEn: 'Casual Top', price: 349, image: 'https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=500&fit=crop' },
    { id: 'w5', gender: 'women', category: 'bottoms', name: 'بنطلون واسع', nameEn: 'Wide Leg Pants', price: 599, image: 'https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?w=400&h=500&fit=crop' },
    { id: 'w6', gender: 'women', category: 'shoes-bags', name: 'حذاء كعب عالي', nameEn: 'High Heel Shoes', price: 799, image: 'https://images.unsplash.com/photo-1543163521-1bf539c55dd1?w=400&h=500&fit=crop' },
    { id: 'w7', gender: 'women', category: 'shoes-bags', name: 'حقيبة يد جلد', nameEn: 'Leather Handbag', price: 1099, image: 'https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=500&fit=crop' },
    { id: 'm1', gender: 'men', category: 'shirts', name: 'قميص رسمي أبيض', nameEn: 'White Formal Shirt', price: 499, image: 'https://images.unsplash.com/photo-1596755094514-f87e34085b24?w=400&h=500&fit=crop' },
    { id: 'm2', gender: 'men', category: 'shirts', name: 'قميص كتان', nameEn: 'Linen Shirt', price: 449, image: 'https://images.unsplash.com/photo-1602810318383-e386cc2a3ccf?w=400&h=500&fit=crop' },
    { id: 'm3', gender: 'men', category: 'tshirts', name: 'تيشيرت أساسي أسود', nameEn: 'Basic Black Tee', price: 249, image: 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=400&h=500&fit=crop' },
    { id: 'm4', gender: 'men', category: 'suits', name: 'بدلة رسمية كحلي', nameEn: 'Navy Suit', price: 2499, image: 'https://images.unsplash.com/photo-1594938298603-c8148c4dae35?w=400&h=500&fit=crop' },
    { id: 'm5', gender: 'men', category: 'shoes', name: 'حذاء جلد كلاسيك', nameEn: 'Classic Leather Shoes', price: 899, image: 'https://images.unsplash.com/photo-1614252238956-18c9858a094d?w=400&h=500&fit=crop' }
];

function getConsumerDataset() {
    return typeof CONSUMER_DATASET !== 'undefined' ? CONSUMER_DATASET : [];
}

function aggregateConsumerAnalytics() {
    const rows = getConsumerDataset();
    if (!rows.length) {
        return { empty: true, totalSessions: 0, purchases: 0, conversionRate: 0 };
    }

    const byMonth = {};
    const byVisitor = {};
    const pageTypes = {
        Administrative: { visits: 0, purchases: 0, bounceSum: 0, count: 0 },
        Informational: { visits: 0, purchases: 0, bounceSum: 0, count: 0 },
        ProductRelated: { visits: 0, purchases: 0, bounceSum: 0, count: 0 }
    };
    let purchases = 0;
    let totalPageValue = 0;
    let purchasePageValue = 0;
    let returning = 0;
    let weekendPurchases = 0;
    let weekendSessions = 0;

    rows.forEach((r) => {
        const month = r.Month;
        byMonth[month] = byMonth[month] || { sessions: 0, purchases: 0, pageValue: 0 };
        byMonth[month].sessions++;
        byMonth[month].pageValue += r.PageValues || 0;
        if (r.Revenue) {
            byMonth[month].purchases++;
            purchases++;
            purchasePageValue += r.PageValues || 0;
        }
        totalPageValue += r.PageValues || 0;

        const vt = r.VisitorType || 'Other';
        byVisitor[vt] = (byVisitor[vt] || 0) + 1;
        if (vt === 'Returning_Visitor') returning++;

        if (r.Weekend) {
            weekendSessions++;
            if (r.Revenue) weekendPurchases++;
        }

        [
            ['Administrative', r.Administrative],
            ['Informational', r.Informational],
            ['ProductRelated', r.ProductRelated]
        ].forEach(([key, val]) => {
            if (val > 0) {
                pageTypes[key].visits += val;
                pageTypes[key].count++;
                pageTypes[key].bounceSum += r.BounceRates || 0;
                if (r.Revenue) pageTypes[key].purchases += val;
            }
        });
    });

    const conversionRate = rows.length ? (purchases / rows.length) * 100 : 0;
    const avgBounce = rows.reduce((s, r) => s + (r.BounceRates || 0), 0) / rows.length;

    return {
        empty: false,
        totalSessions: rows.length,
        purchases,
        conversionRate,
        totalPageValue,
        purchasePageValue,
        returning,
        avgBounce,
        engagementRate: (1 - avgBounce) * 100,
        byMonth,
        byVisitor,
        pageTypes,
        weekendConversion: weekendSessions ? (weekendPurchases / weekendSessions) * 100 : 0
    };
}
