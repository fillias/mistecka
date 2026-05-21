type CountryFlagProps = {
    code: string | null | undefined;
    name?: string;
    className?: string;
    squared?: boolean;
    title?: string;
};

function normalizeCode(code: string | null | undefined) {
    return (code ?? '').trim().toLowerCase();
}

function isValidAlpha2(code: string) {
    return /^[a-z]{2}$/.test(code);
}

export default function CountryFlag({ code, name, className = '', squared = false, title }: CountryFlagProps) {
    const normalized = normalizeCode(code);

    if (!isValidAlpha2(normalized)) {
        return (
            <span
                className={`inline-flex h-4 w-6 items-center justify-center rounded-sm border border-black/10 bg-black/5 text-[10px] leading-none text-black/40 dark:border-white/10 dark:bg-white/5 dark:text-white/40 ${className}`}
                role="img"
                aria-label={name ? `Vlajka pro ${name} není dostupná` : 'Vlajka není dostupná'}
                title={title ?? name ?? undefined}
            >
                —
            </span>
        );
    }

    return (
        <span
            className={`fi fi-${normalized} ${squared ? 'fis' : ''} inline-block shrink-0 ${className}`}
            role="img"
            aria-label={name ? `Vlajka ${name}` : `Vlajka ${normalized.toUpperCase()}`}
            title={title ?? name ?? normalized.toUpperCase()}
        />
    );
}
