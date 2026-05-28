import ThemeToggle from './ThemeToggle';
import { Suspense } from 'react';
import { LogoutFooterAction } from './LogoutFooterAction';

export async function Footer() {
    return (
        <footer className="mt-auto border-t py-2 sm:py-2" style={{ borderColor: 'rgb(var(--border))' }}>
            <div className="flex items-center justify-between gap-4">
                <div className="flex items-center justify-start">
                    <ThemeToggle />
                </div>

                <Suspense fallback={null}>
                    <LogoutFooterAction />
                </Suspense>
            </div>
        </footer>
    );
}
