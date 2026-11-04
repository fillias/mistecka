'use client';

import { useSyncExternalStore } from 'react';

type Theme = 'dark' | 'light';

function subscribe(callback: () => void) {
    const observer = new MutationObserver(callback);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    window.addEventListener('storage', callback);
    return () => {
        observer.disconnect();
        window.removeEventListener('storage', callback);
    };
}

function getSnapshot(): Theme {
    const theme = document.documentElement.getAttribute('data-theme');
    return theme === 'light' ? 'light' : 'dark';
}

function getServerSnapshot(): Theme {
    return 'dark';
}

function subscribeMounted() {
    return () => {};
}

export default function ThemeToggle() {
    const mounted = useSyncExternalStore(subscribeMounted, () => true, () => false);
    const theme = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

    function toggleTheme() {
        const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
    }

    const isDark = theme === 'dark';

    return (
        <button
            type="button"
            onClick={toggleTheme}
            className="theme-toggle"
            aria-label={mounted ? (isDark ? 'Přepnout na světlý motiv' : 'Přepnout na tmavý motiv') : 'Přepnout motiv'}
            title={mounted ? (isDark ? 'Světlý motiv' : 'Tmavý motiv') : 'Přepnout motiv'}
        >
            <span aria-hidden="true" className="text-lg leading-none sm:text-xl">
                {!mounted ? '◐' : isDark ? '☀️' : '🌙'}
            </span>
        </button>
    );
}
