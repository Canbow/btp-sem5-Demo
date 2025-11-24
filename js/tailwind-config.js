// Tailwind config must be available before loading Tailwind CDN
window.tailwind = window.tailwind || {};
// Set config explicitly on window.tailwind to avoid globals lookup issues
window.tailwind.config = {
    // Safelist common utility patterns that are generated in JSX (rendered after Tailwind runs)
    safelist: [
        { pattern: /bg-(bg|accent)-.*/ },
        { pattern: /text-(bg|accent|gray|white|green|red)-?.*/ },
        { pattern: /border-(bg|accent|white|green|red)-?.*/ },
        { pattern: /from-accent-.*/ },
        { pattern: /to-accent-.*/ },
        { pattern: /blur-.*/ },
        { pattern: /animate-.*/ },
        { pattern: /scale-.*/ },
        { pattern: /shadow-.*/ },
        { pattern: /w-\[.*\]|h-\[.*\]/ },
        { pattern: /col-span-\d+/ },
        { pattern: /grid-cols-\d+/ },
        { pattern: /-translate-x-.*/ },
        { pattern: /-translate-y-.*/ }
    ],
    theme: {
        extend: {
            colors: {
                bg: {
                    main: '#0F111A',
                    panel: '#161925',
                    lighter: '#1F2335'
                },
                accent: {
                    // Use aquagreen as the primary accent (previously cyan)
                    cyan: '#00F0A0',
                    red: '#FF2A6D',
                    purple: '#7000FF',
                    blue: '#05D9E8'
                }
            },
            fontFamily: {
                sans: ['Inter', 'sans-serif'],
                mono: ['JetBrains Mono', 'monospace']
            }
        }
    }
};
