// Service layer (Firebase with fallback) extracted from index.html
(function(window){
    const createService = () => {
        let db = null;
        let auth = null;
        let isDemoMode = false;

        const firebaseConfig = {
            apiKey: "", // Needs real key
            authDomain: "deepfake-detector-demo.firebaseapp.com",
            projectId: "deepfake-detector-demo",
            storageBucket: "deepfake-detector-demo.appspot.com",
            messagingSenderId: "123456789",
            appId: "1:123456789:web:abcdef123456"
        };

        try {
            if (typeof firebase !== 'undefined' && firebase.apps && !firebase.apps.length) {
                if(firebaseConfig.apiKey && firebaseConfig.apiKey !== "") {
                    firebase.initializeApp(firebaseConfig);
                    db = firebase.firestore();
                    auth = firebase.auth();
                } else {
                    throw new Error("No API Key provided");
                }
            }
        } catch (e) {
            console.warn("Firebase Initialization failed. Switching to Demo Mode.", e);
            isDemoMode = true;
        }

        return {
            isDemoMode,
            saveScan: async (fileData) => {
                if (isDemoMode) {
                    console.log("Demo Mode: Scan saved locally (simulated).", fileData);
                    const existing = JSON.parse(localStorage.getItem('demo_scans') || '[]');
                    const newScan = { 
                        ...fileData, 
                        id: 'demo_' + Date.now(), 
                        timestamp: new Date().toISOString() 
                    };
                    localStorage.setItem('demo_scans', JSON.stringify([newScan, ...existing]));
                    return;
                }
                
                const user = auth.currentUser || (await auth.signInAnonymously()).user;
                await db.collection('scans').add({
                    ...fileData,
                    userId: user.uid,
                    timestamp: firebase.firestore.FieldValue.serverTimestamp()
                });
            },
            subscribeToHistory: (callback) => {
                if (isDemoMode) {
                    const data = JSON.parse(localStorage.getItem('demo_scans') || '[]');
                    callback(data.map(d => ({...d, timestamp: { toDate: () => new Date(d.timestamp) }})));
                    return () => {}; 
                }

                return db.collection('scans')
                    .orderBy('timestamp', 'desc')
                    .limit(10)
                    .onSnapshot(snapshot => {
                        const data = snapshot.docs.map(doc => ({
                            id: doc.id,
                            ...doc.data()
                        }));
                        callback(data);
                    }, err => {
                        console.error("Firestore Error:", err);
                        callback([]); 
                    });
            }
        };
    };

    window.Service = createService();
})(window);
