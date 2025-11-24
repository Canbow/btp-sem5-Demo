// Main React app (JSX)
const { useState, useEffect, useRef } = React;

// 1. Sidebar
const Sidebar = ({ activeTab, setActiveTab }) => {
    const menuItems = [
        { id: 'dashboard', icon: 'layout-dashboard', label: 'Dashboard' },
        { id: 'upload', icon: 'upload-cloud', label: 'Upload & Scan' },
        { id: 'history', icon: 'history', label: 'History' },
        { id: 'settings', icon: 'settings', label: 'Settings' },
        { id: 'profile', icon: 'user', label: 'Profile' },
    ];

    useEffect(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, []);

    return (
        <div className="w-64 h-screen bg-bg-main border-r border-white/5 flex flex-col fixed left-0 top-0 z-50">
            <div className="p-6">
                <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-accent-cyan to-accent-blue neon-text">
                    DEEPFAKE<br/>DETECTION
                </h1>
                <span className="text-[10px] text-accent-cyan border border-accent-cyan/30 rounded px-1.5 py-0.5 mt-2 inline-block font-mono bg-accent-cyan/5">
                    v1.0.4 (BETA)
                </span>
            </div>
            
            <nav className="flex-1 px-4 space-y-2 mt-8">
                {menuItems.map((item) => (
                    <button
                        key={item.id}
                        onClick={() => setActiveTab(item.id)}
                        className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                            activeTab === item.id 
                            ? 'bg-accent-cyan/10 text-accent-cyan border border-accent-cyan/20 neon-border' 
                            : 'text-gray-400 hover:bg-white/5 hover:text-white'
                        }`}
                    >
                        <i data-lucide={item.icon}></i>
                        <span className="font-medium">{item.label}</span>
                        {activeTab === item.id && (
                            <div className="ml-auto w-1.5 h-1.5 rounded-full bg-accent-cyan shadow-[0_0_10px_#00F0FF]"></div>
                        )}
                    </button>
                ))}
            </nav>
            
            <div className="p-4 border-t border-white/5">
                <div className="bg-bg-panel p-3 rounded-lg flex items-center space-x-3 border border-white/5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-accent-cyan to-accent-purple flex items-center justify-center text-xs font-bold text-white">
                        JD
                    </div>
                    <div className="text-sm">
                        <p className="text-white font-medium">John Doe</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 2. Upload Area
const UploadArea = ({ onUpload }) => {
    const [isDragging, setIsDragging] = useState(false);

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setIsDragging(true);
        } else if (e.type === "dragleave") {
            setIsDragging(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            onUpload(e.dataTransfer.files[0]);
        }
    };

    const handleFileSelect = (e) => {
        if (e.target.files && e.target.files[0]) {
            onUpload(e.target.files[0]);
        }
    };

    return (
        <div 
            className={`relative h-48 rounded-2xl border-2 border-dashed transition-all duration-300 flex flex-col items-center justify-center cursor-pointer group overflow-hidden ${
                isDragging 
                ? 'border-accent-cyan bg-accent-cyan/5 scale-[1.01]' 
                : 'border-white/10 hover:border-accent-cyan/50 hover:bg-white/5'
            }`}
            onDragEnter={handleDrag}
            onDragLeave={handleDrag}
            onDragOver={handleDrag}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput').click()}
        >
            <input type="file" id="fileInput" className="hidden" accept="video/*" onChange={handleFileSelect} />
            
            <div className="w-16 h-16 rounded-full bg-bg-lighter flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300 border border-white/10 group-hover:border-accent-cyan/50 shadow-lg">
                <i data-lucide="upload-cloud" className={`w-8 h-8 ${isDragging ? 'text-accent-cyan' : 'text-gray-400 group-hover:text-white'}`}></i>
            </div>
            <h3 className="text-lg font-semibold text-white mb-1">Drag & Drop Video</h3>
            <p className="text-sm text-gray-500">or click to browse files (MP4, AVI, MOV)</p>
        </div>
    );
};

// 3. Analysis View
const AnalysisDashboard = ({ file }) => {
    const [scanning, setScanning] = useState(true);
    const [progress, setProgress] = useState(0);
    const canvasRef = useRef(null);

    // Scan Simulation
    useEffect(() => {
        let interval;
        if (scanning) {
            interval = setInterval(() => {
                setProgress(prev => {
                    if (prev >= 100) {
                        clearInterval(interval);
                        setScanning(false);
                        // Save to DB (or Mock) when scan completes
                        Service.saveScan({
                            fileName: file.name,
                            result: 'FAKE',
                            confidence: 96.4,
                            issues: ['Unnatural Blinking', 'Lip Sync mismatch']
                        });
                        return 100;
                    }
                    return prev + 2; 
                });
            }, 50);
        }
        return () => clearInterval(interval);
    }, [scanning]);

    // Draw Chart
    useEffect(() => {
        if (!scanning && canvasRef.current && typeof Chart !== 'undefined') {
            const ctx = canvasRef.current.getContext('2d');
            new Chart(ctx, {
                type: 'line',
                data: {
                    labels: Array.from({length: 50}, (_, i) => i),
                    datasets: [{
                        label: 'Sync Variance',
                        data: Array.from({length: 50}, () => Math.random() * 100),
                        borderColor: '#00F0FF',
                        backgroundColor: 'rgba(0, 240, 255, 0.1)',
                        borderWidth: 2,
                        tension: 0.4,
                        fill: true,
                        pointRadius: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: { legend: { display: false } },
                    scales: {
                        x: { display: false },
                        y: { 
                            grid: { color: 'rgba(255,255,255,0.1)' },
                            ticks: { color: '#666' }
                        }
                    }
                }
            });
        }
    }, [scanning]);

    if (scanning) {
        return (
            <div className="flex flex-col items-center justify-center h-[600px] bg-bg-panel rounded-2xl border border-white/5 relative overflow-hidden">
                <div className="w-64 h-64 rounded-full border-4 border-white/5 flex items-center justify-center relative">
                    <div className="absolute w-full h-full border-4 border-accent-cyan rounded-full border-t-transparent animate-spin"></div>
                    <div className="text-4xl font-bold text-white">{progress}%</div>
                </div>
                <h2 className="mt-8 text-xl font-semibold text-white tracking-wider animate-pulse">ANALYZING FRAMES...</h2>
                <p className="text-gray-500 mt-2">Checking Audio-Visual Synchronization</p>
            </div>
        );
    }

    return (
        <div className="grid grid-cols-12 gap-6 animate-fade-in">
            {/* Left Column: Video Player */}
            <div className="col-span-8 space-y-6">
                <div className="bg-bg-panel rounded-2xl border border-white/5 overflow-hidden relative group">
                    {/* Mock Video Player Header */}
                    <div className="absolute top-4 right-4 z-10 flex space-x-3">
                        <button className="bg-bg-main/80 backdrop-blur border border-accent-cyan/50 text-accent-cyan px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-2">
                            <i data-lucide="activity" className="w-3 h-3"></i>
                            <span>Artifact Heatmap</span>
                        </button>
                        <button className="bg-bg-main/80 backdrop-blur border border-white/10 text-white px-3 py-1.5 rounded-lg text-xs font-medium flex items-center space-x-2">
                            <i data-lucide="file-video" className="w-3 h-3"></i>
                            <span>Original</span>
                        </button>
                    </div>

                    {/* Video Content */}
                    <div className="relative aspect-video bg-black flex items-center justify-center overflow-hidden">
                        <img 
                            src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?q=80&w=2550&auto=format&fit=crop" 
                            alt="Video Analysis" 
                            className="w-full h-full object-cover opacity-60"
                        />
                        {/* Heatmap Overlay */}
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-accent-red rounded-full blur-[100px] opacity-20 animate-pulse"></div>
                        <div className="scan-line"></div>

                        {/* Controls Overlay */}
                        <div className="absolute bottom-0 left-0 w-full p-6 bg-gradient-to-t from-bg-main to-transparent">
                            <div className="flex items-center justify-between mb-2">
                                <div className="flex space-x-4">
                                    <button className="text-white hover:text-accent-cyan"><i data-lucide="play"></i></button>
                                    <button className="text-white hover:text-accent-cyan"><i data-lucide="volume-2"></i></button>
                                </div>
                                <button className="text-white hover:text-accent-cyan"><i data-lucide="maximize"></i></button>
                            </div>
                            {/* Timeline */}
                            <div className="relative h-1 bg-white/10 rounded-full mt-4">
                                <div className="absolute top-0 left-0 h-full w-1/3 bg-accent-cyan rounded-full"></div>
                                <div className="absolute -top-3 left-[20%] text-accent-red"><i data-lucide="flag" className="w-3 h-3 fill-current"></i></div>
                                <div className="absolute -top-3 left-[60%] text-accent-red"><i data-lucide="flag" className="w-3 h-3 fill-current"></i></div>
                            </div>
                            <div className="flex justify-between text-xs text-gray-500 mt-2 font-mono">
                                <span>00:12</span>
                                <span>00:45</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Column: Analysis Results */}
            <div className="col-span-4 space-y-6">
                <div className="bg-bg-panel rounded-2xl border border-accent-red/30 p-6 relative overflow-hidden neon-red-border">
                    <div className="absolute top-0 right-0 p-4 opacity-10">
                        <i data-lucide="alert-triangle" className="w-24 h-24 text-accent-red"></i>
                    </div>
                    <h3 className="text-gray-400 text-sm font-medium uppercase tracking-wider mb-1">Analysis Verdict</h3>
                    <div className="text-3xl font-bold text-accent-red mb-2">DEEPFAKE DETECTED</div>
                    <div className="flex items-center space-x-2">
                        <div className="h-2 w-32 bg-bg-main rounded-full overflow-hidden">
                            <div className="h-full w-[96%] bg-accent-red"></div>
                        </div>
                        <span className="text-xl font-bold text-white">96.4%</span>
                        <span className="text-xs text-gray-500">Confidence</span>
                    </div>
                </div>

                <div className="bg-bg-panel rounded-2xl border border-white/5 p-6">
                    <h3 className="text-white font-semibold mb-4 flex items-center space-x-2">
                        <i data-lucide="search" className="w-4 h-4 text-accent-cyan"></i>
                        <span>Detection Details</span>
                    </h3>
                    <div className="space-y-4">
                        <div className="p-3 bg-bg-lighter rounded-lg border-l-2 border-accent-red">
                            <h4 className="text-accent-red text-sm font-bold mb-1">Unnatural Blinking Pattern</h4>
                            <p className="text-gray-400 text-xs leading-relaxed">
                                Temporal analysis detected irregular eye closure rates inconsistent with natural human physiology (0.2s variance).
                            </p>
                        </div>
                        <div className="p-3 bg-bg-lighter rounded-lg border-l-2 border-accent-purple">
                            <h4 className="text-accent-purple text-sm font-bold mb-1">Lip-Audio Desync</h4>
                            <p className="text-gray-400 text-xs leading-relaxed">
                                MFCC features lag behind visual phonemes by 4 frames in highlighted segments.
                            </p>
                        </div>
                    </div>
                </div>

                <div className="bg-bg-panel rounded-2xl border border-white/5 p-6 h-48 flex flex-col">
                    <h3 className="text-white font-semibold mb-2 text-sm">Frequency Domain Analysis</h3>
                    <div className="flex-1 relative">
                        <canvas ref={canvasRef}></canvas>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 4. History View
const HistoryView = () => {
    const [scans, setScans] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = Service.subscribeToHistory((data) => {
            setScans(data);
            setLoading(false);
        });
        return () => unsubscribe();
    }, []);

    return (
        <div className="bg-bg-panel rounded-2xl border border-white/5 overflow-hidden">
            <div className="p-6 border-b border-white/5">
                <h2 className="text-xl font-bold text-white">Scan History</h2>
            </div>
            <div className="overflow-x-auto">
                <table className="w-full text-left text-sm text-gray-400">
                    <thead className="bg-bg-lighter text-gray-200 uppercase text-xs font-semibold">
                        <tr>
                            <th className="px-6 py-4">File Name</th>
                            <th className="px-6 py-4">Date</th>
                            <th className="px-6 py-4">Verdict</th>
                            <th className="px-6 py-4">Confidence</th>
                            <th className="px-6 py-4 text-right">Action</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-white/5">
                        {loading ? (
                            <tr><td colSpan="5" className="text-center py-8">Loading history...</td></tr>
                        ) : scans.length === 0 ? (
                            <tr><td colSpan="5" className="text-center py-8">No scans found. Upload a video to start.</td></tr>
                        ) : (
                            scans.map((scan) => (
                                <tr key={scan.id} className="hover:bg-white/5 transition-colors">
                                    <td className="px-6 py-4 font-medium text-white flex items-center space-x-3">
                                        <div className="w-8 h-8 rounded bg-bg-main flex items-center justify-center border border-white/10">
                                            <i data-lucide="file-video" className="w-4 h-4"></i>
                                        </div>
                                        <span>{scan.fileName || "Unknown Video"}</span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {scan.timestamp?.toDate().toLocaleDateString()}
                                    </td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 rounded text-xs font-bold ${
                                            scan.result === 'FAKE' 
                                            ? 'bg-accent-red/10 text-accent-red border border-accent-red/20' 
                                            : 'bg-green-500/10 text-green-500 border border-green-500/20'
                                        }`}>
                                            {scan.result}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4">
                                        {scan.confidence}%
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="text-accent-cyan hover:text-white transition-colors">View Report</button>
                                    </td>
                                </tr>
                            ))
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// 5. Settings View
const SettingsView = () => {
    return (
        <div className="max-w-4xl mx-auto space-y-6">
            <div className="bg-bg-panel rounded-2xl border border-white/5 p-6">
                <h2 className="text-xl font-bold text-white mb-6 flex items-center">
                    <i data-lucide="settings" className="w-6 h-6 mr-2 text-accent-cyan"></i>
                    System Preferences
                </h2>
                
                <div className="space-y-6">
                    {/* Notifications */}
                    <div className="flex items-center justify-between pb-4 border-b border-white/5">
                        <div>
                            <h3 className="font-medium text-white">Email Notifications</h3>
                            <p className="text-sm text-gray-500">Receive alerts when a scan completes</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" defaultChecked />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-cyan/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-cyan"></div>
                        </label>
                    </div>

                    {/* Sensitivity Slider */}
                    <div className="pb-4 border-b border-white/5">
                        <div className="flex justify-between mb-2">
                            <h3 className="font-medium text-white">Detection Sensitivity</h3>
                            <span className="text-accent-cyan font-mono">High</span>
                        </div>
                        <input type="range" className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-accent-cyan" />
                        <p className="text-sm text-gray-500 mt-2">Higher sensitivity may increase false positives.</p>
                    </div>

                    {/* Data Retention */}
                    <div className="flex items-center justify-between">
                        <div>
                            <h3 className="font-medium text-white">Auto-Delete History</h3>
                            <p className="text-sm text-gray-500">Remove scan data after 30 days</p>
                        </div>
                        <label className="relative inline-flex items-center cursor-pointer">
                            <input type="checkbox" className="sr-only peer" />
                            <div className="w-11 h-6 bg-gray-700 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-accent-cyan/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-accent-cyan"></div>
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
};

// 6. Profile View
const ProfileView = () => {
    return (
        <div className="max-w-4xl mx-auto grid grid-cols-12 gap-6">
            {/* User Card */}
            <div className="col-span-4">
                <div className="bg-bg-panel rounded-2xl border border-white/5 p-6 flex flex-col items-center text-center">
                    <div className="w-24 h-24 rounded-full bg-gradient-to-tr from-accent-cyan to-accent-purple flex items-center justify-center text-2xl font-bold text-white mb-4 shadow-lg shadow-accent-cyan/20">
                        JD
                    </div>
                    <h2 className="text-xl font-bold text-white mb-6">John Doe</h2>
                    
                    <div className="w-full flex justify-center gap-8 text-center border-t border-white/5 pt-6">
                        <div>
                            <div className="text-2xl font-bold text-white">142</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Total Scans</div>
                        </div>
                        <div>
                            <div className="text-2xl font-bold text-white">98%</div>
                            <div className="text-xs text-gray-500 uppercase tracking-wider">Accuracy</div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Details Form */}
            <div className="col-span-8">
                <div className="bg-bg-panel rounded-2xl border border-white/5 p-6">
                    <h3 className="text-lg font-bold text-white mb-6">Account Details</h3>
                    <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">First Name</label>
                                <input type="text" defaultValue="John" className="w-full bg-bg-main border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent-cyan focus:outline-none" />
                            </div>
                            <div>
                                <label className="block text-sm text-gray-400 mb-1">Last Name</label>
                                <input type="text" defaultValue="Doe" className="w-full bg-bg-main border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent-cyan focus:outline-none" />
                            </div>
                        </div>
                        <div>
                            <label className="block text-sm text-gray-400 mb-1">Email Address</label>
                            <input type="email" defaultValue="john.doe@agency.gov" className="w-full bg-bg-main border border-white/10 rounded-lg px-4 py-2 text-white focus:border-accent-cyan focus:outline-none" />
                        </div>
                        
                        <div className="pt-4 flex justify-end">
                            <button className="px-6 py-2 bg-accent-cyan text-bg-main font-bold rounded-lg hover:bg-white transition-colors">
                                Save Changes
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

// --- Main App ---
const App = () => {
    const [activeTab, setActiveTab] = useState('upload');
    const [currentFile, setCurrentFile] = useState(null);

    useEffect(() => {
        if (typeof lucide !== 'undefined') {
            lucide.createIcons();
        }
    }, [activeTab, currentFile]);

    const handleUpload = (file) => {
        setCurrentFile(file);
        setActiveTab('dashboard'); 
    };

    return (
        <div className="flex min-h-screen">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <main className="flex-1 ml-64 p-8 overflow-y-auto h-screen relative">
                {/* Glows */}
                <div className="fixed top-0 right-0 w-[500px] h-[500px] bg-accent-purple/20 blur-[150px] rounded-full pointer-events-none"></div>
                <div className="fixed bottom-0 left-64 w-[500px] h-[500px] bg-accent-cyan/10 blur-[150px] rounded-full pointer-events-none"></div>

                <header className="flex justify-between items-center mb-8 relative z-10">
                    <div>
                        <h1 className="text-2xl font-bold text-white">{
                            activeTab === 'upload' ? 'Upload Media' : 
                            activeTab === 'dashboard' ? 'Analysis Dashboard' : 
                            activeTab === 'history' ? 'Scan History' : 
                            activeTab === 'settings' ? 'Settings' : 'User Profile'
                        }</h1>
                        <p className="text-gray-500 text-sm mt-1">Deepfake Detection System v1.0</p>
                    </div>
                    <div className="flex items-center space-x-4">
                        <button className="p-2 text-gray-400 hover:text-white relative">
                            <i data-lucide="bell" className="w-5 h-5"></i>
                            <div className="absolute top-1 right-2 w-2 h-2 bg-accent-red rounded-full border border-bg-main"></div>
                        </button>
                    </div>
                </header>

                <div className="relative z-10">
                    {activeTab === 'upload' && (
                        <div className="space-y-6 max-w-4xl mx-auto mt-12">
                            <UploadArea onUpload={handleUpload} />
                            <div className="grid grid-cols-3 gap-6 mt-8">
                                <div className="p-4 bg-bg-panel rounded-xl border border-white/5">
                                    <div className="w-10 h-10 rounded-lg bg-accent-blue/10 flex items-center justify-center text-accent-blue mb-3">
                                        <i data-lucide="video"></i>
                                    </div>
                                    <h3 className="font-semibold text-white">Video Analysis</h3>
                                    <p className="text-xs text-gray-500 mt-1">Supports MP4, AVI, MOV up to 4K resolution</p>
                                </div>
                                <div className="p-4 bg-bg-panel rounded-xl border border-white/5">
                                    <div className="w-10 h-10 rounded-lg bg-accent-purple/10 flex items-center justify-center text-accent-purple mb-3">
                                        <i data-lucide="mic"></i>
                                    </div>
                                    <h3 className="font-semibold text-white">Audio Forensics</h3>
                                    <p className="text-xs text-gray-500 mt-1">Spectral analysis for voice cloning detection</p>
                                </div>
                                <div className="p-4 bg-bg-panel rounded-xl border border-white/5">
                                    <div className="w-10 h-10 rounded-lg bg-accent-red/10 flex items-center justify-center text-accent-red mb-3">
                                        <i data-lucide="shield-check"></i>
                                    </div>
                                    <h3 className="font-semibold text-white">Real-time Scan</h3>
                                    <p className="text-xs text-gray-500 mt-1">Avg. processing time: 24ms/frame</p>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'dashboard' && (
                        currentFile ? <AnalysisDashboard file={currentFile} /> : (
                            <div className="text-center py-20">
                                <i data-lucide="upload-cloud" className="w-16 h-16 text-gray-600 mx-auto mb-4"></i>
                                <h3 className="text-xl font-semibold text-gray-400">No Active Scan</h3>
                                <p className="text-gray-600 mt-2">Go to Upload & Scan to start a new analysis</p>
                                <button 
                                    onClick={() => setActiveTab('upload')}
                                    className="mt-6 px-6 py-2 bg-accent-cyan text-bg-main font-bold rounded-lg hover:bg-white transition-colors"
                                >
                                    Start New Scan
                                </button>
                            </div>
                        )
                    )}

                    {activeTab === 'history' && <HistoryView />}
                    {activeTab === 'settings' && <SettingsView />}
                    {activeTab === 'profile' && <ProfileView />}
                </div>
            </main>
        </div>
    );
};

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
