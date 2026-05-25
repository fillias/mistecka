type Props = {
    label?: string;
};

export default function Spinner({ label = 'Načítám seznam' }: Props) {
    return (
        <div
            className="card flex min-h-40 items-center justify-center"
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex items-center gap-2" aria-hidden="true">
                    <span
                        className="h-2.5 w-2.5 animate-bounce rounded-full bg-[rgb(var(--text))]"
                        style={{ animationDelay: '0ms' }}
                    />
                    <span
                        className="h-2.5 w-2.5 animate-bounce rounded-full bg-[rgb(var(--text))]"
                        style={{ animationDelay: '150ms' }}
                    />
                    <span
                        className="h-2.5 w-2.5 animate-bounce rounded-full bg-[rgb(var(--text))]"
                        style={{ animationDelay: '300ms' }}
                    />
                </div>
                <p className="meta-text">{label}</p>
            </div>
        </div>
    );
}
