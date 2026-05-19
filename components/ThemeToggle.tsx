'use client';

import { useEffect, useState } from 'react';

type Theme = 'dark' | 'light';

export default function ThemeToggle() {
    const [theme, setTheme] = useState<Theme>('dark');
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        const root = document.documentElement;
        const currentTheme = root.getAttribute('data-theme');

        if (currentTheme === 'light' || currentTheme === 'dark') {
            setTheme(currentTheme);
        } else {
            root.setAttribute('data-theme', 'dark');
            localStorage.setItem('theme', 'dark');
            setTheme('dark');
        }

        setMounted(true);
    }, []);

    function toggleTheme() {
        const root = document.documentElement;
        const nextTheme: Theme = theme === 'dark' ? 'light' : 'dark';

        root.setAttribute('data-theme', nextTheme);
        localStorage.setItem('theme', nextTheme);
        setTheme(nextTheme);
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
