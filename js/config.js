/** Firebase — ضع مفاتيح مشروعك هنا عند التفعيل */
const FIREBASE_CONFIG = {
    apiKey: '',
    authDomain: '',
    projectId: '',
    storageBucket: '',
    messagingSenderId: '',
    appId: ''
};

const PAGES_WITH_HEADER = new Set([
    'home-page', 'women-page', 'men-page', 'products-page', 'product-detail-page',
    'cart-page', 'checkout-page', 'wishlist-page', 'profile-page', 'orders-page',
    'analytics-page'
]);

const PAGES_WITH_BOTTOM_NAV = new Set([
    'home-page', 'women-page', 'men-page', 'cart-page', 'profile-page', 'analytics-page'
]);

const MONTH_ORDER = ['Feb', 'Mar', 'May', 'June', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const MONTH_LABELS_AR = {
    Feb: 'فبراير', Mar: 'مارس', May: 'مايو', June: 'يونيو',
    Jul: 'يوليو', Aug: 'أغسطس', Sep: 'سبتمبر', Oct: 'أكتوبر', Nov: 'نوفمبر', Dec: 'ديسمبر'
};
const VISITOR_LABELS_AR = {
    Returning_Visitor: 'زائر عائد',
    New_Visitor: 'زائر جديد',
    Other: 'أخرى'
};
const PAGE_TYPE_LABELS_AR = {
    Administrative: 'إداري',
    Informational: 'معلوماتي',
    ProductRelated: 'منتجات'
};
const MONTH_LABELS_EN = {
    Feb: 'February', Mar: 'March', May: 'May', June: 'June',
    Jul: 'July', Aug: 'August', Sep: 'September', Oct: 'October',
    Nov: 'November', Dec: 'December'
};
const VISITOR_LABELS_EN = {
    Returning_Visitor: 'Returning Visitor',
    New_Visitor: 'New Visitor',
    Other: 'Other'
};
const PAGE_TYPE_LABELS_EN = {
    Administrative: 'Administrative',
    Informational: 'Informational',
    ProductRelated: 'Product Related'
};
const CATEGORY_TITLES_AR = {
    dresses: 'فساتين', tops: 'بلوزات', bottoms: 'بناطيل',
    'shoes-bags': 'أحذية وحقائب', shirts: 'قمصان', tshirts: 'تيشيرتات',
    suits: 'بدلات', shoes: 'أحذية'
};
const CATEGORY_TITLES_EN = {
    dresses: 'Dresses', tops: 'Tops', bottoms: 'Bottoms',
    'shoes-bags': 'Shoes & Bags', shirts: 'Shirts', tshirts: 'T-shirts',
    suits: 'Suits', shoes: 'Shoes'
};
