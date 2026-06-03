let db = null;

function initFirebase() {
    if (!FIREBASE_CONFIG.apiKey || typeof firebase === 'undefined') return;
    try {
        if (!firebase.apps.length) firebase.initializeApp(FIREBASE_CONFIG);
        db = firebase.firestore();
    } catch (e) {
        console.warn('Firebase init skipped:', e.message);
    }
}

async function syncProductsFromFirestore() {
    if (!db) return;
    try {
        const snap = await db.collection('products').get();
        if (!snap.empty) {
            console.info('Firestore products available:', snap.size);
        }
    } catch (e) {
        console.warn('Firestore read failed:', e.message);
    }
}
