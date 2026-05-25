'use client';

import Link, { type LinkProps } from 'next/link';
import { forwardRef, type AnchorHTMLAttributes, type MouseEvent } from 'react';
import { usePathname } from 'next/navigation';
import { useNavigationOverlay } from '@/components/NavigationOverlayProvider';

type Props = LinkProps &
    Omit<AnchorHTMLAttributes<HTMLAnchorElement>, 'href'> & {
        skipOverlay?: boolean;
    };

const LoadingLink = forwardRef<HTMLAnchorElement, Props>(function LoadingLink(
    { onClick, href, skipOverlay = false, children, ...rest },
    ref
) {
    const pathname = usePathname();
    const { show } = useNavigationOverlay();

    return (
        <Link
            ref={ref}
            href={href}
            {...rest}
            onClick={(e: MouseEvent<HTMLAnchorElement>) => {
                onClick?.(e);

                if (e.defaultPrevented || skipOverlay) return;
                if (e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
                if (rest.target === '_blank') return;

                const nextHref = typeof href === 'string' ? href : (href.pathname ?? '');
                const currentPath = pathname ?? '';

                if (typeof nextHref === 'string' && nextHref !== currentPath) {
                    show();
                }
            }}
        >
            {children}
        </Link>
    );
});

export default LoadingLink;
