import '../css/app.css';

import { createInertiaApp } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { initializeTheme } from './hooks/use-appearance';

// Extend window interface for TypeScript
declare global {
    interface Window {
        __APP_NAME__: string;
        __SET_APP_NAME__: (name: string) => void;
    }
}

// Initialize global appName
window.__APP_NAME__ = 'Laravel';
window.__SET_APP_NAME__ = (name: string) => {
    window.__APP_NAME__ = name;
};

createInertiaApp({
    title: (title) => title ? `${title} - ${window.__APP_NAME__}` : window.__APP_NAME__,
    resolve: (name) => resolvePageComponent(`./pages/${name}.tsx`, import.meta.glob('./pages/**/*.tsx')),
    setup({ el, App, props }) {
        const root = createRoot(el);

        // Get appName from shared props (pengaturan.name) on initial load
        const pengaturan = (props.initialPage.props as { pengaturan?: { name?: string } }).pengaturan;
        if (pengaturan?.name) {
            window.__APP_NAME__ = pengaturan.name;
            // Update initial document title with appName
            const currentTitle = document.title;
            if (currentTitle && !currentTitle.includes(window.__APP_NAME__)) {
                document.title = `${currentTitle} - ${window.__APP_NAME__}`;
            }
        }

        root.render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});

// This will set light / dark mode on load...
initializeTheme();
