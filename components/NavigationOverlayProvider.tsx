'use client';

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import Spinner from '@/app/UI/Spinner';

type NavigationOverlayContextValue = {
    show: () => void;
    hide: () => void;
};

const NavigationOverlayContext = createContext<NavigationOverlayContextValue | null>(null);

export function NavigationOverlayProvider({ children }: { children: ReactNode }) {
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const [visible, setVisible] = useState(false);
    const timerRef = useRef<number | null>(null);

    const hide = useCallback(() => {
        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }
        setVisible(false);
    }, []);

    const show = useCallback(() => {
        if (timerRef.current) {
            window.clearTimeout(timerRef.current);
        }

        timerRef.current = window.setTimeout(() => {
            setVisible(true);
        }, 120);
    }, []);

    useEffect(() => {
        hide();
    }, [pathname, searchParams, hide]);

    useEffect(() => {
        return () => {
            if (timerRef.current) window.clearTimeout(timerRef.current);
        };
    }, []);

    const value = useMemo(() => ({ show, hide }), [show, hide]);

    return (
        <NavigationOverlayContext.Provider value={value}>
            {children}

            {visible && (
                <div className="pointer-events-none fixed inset-0 z-[120] flex items-center justify-center bg-black/20 ">
                    <Spinner label="Načítám…" />
                </div>
            )}
        </NavigationOverlayContext.Provider>
    );
}

export function useNavigationOverlay() {
    const context = useContext(NavigationOverlayContext);

    if (!context) {
        throw new Error('useNavigationOverlay must be used inside NavigationOverlayProvider');
    }

    return context;
}
