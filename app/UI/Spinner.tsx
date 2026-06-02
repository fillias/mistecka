type Props = {
    label?: string;
};

export default function Spinner({ label = 'Načítám seznam' }: Props) {
    return (
        <div
            className="flex min-w-[180px] items-center justify-center rounded-2xl  px-6 py-5 shadow-xl"
            style={{
                backgroundColor: 'rgb(var(--surface) / 3)',
                borderColor: 'rgb(var(--border))',
                color: 'rgb(var(--text))',
                bottom: '0.5rem',
                position: 'absolute',
                left: '50%',
                transform: 'translateX(-50%)'
            }}
            role="status"
            aria-live="polite"
            aria-busy="true"
        >
            <div className="flex flex-col items-center gap-4 text-center">
                <div className="flex items-center gap-2" aria-hidden="true">
                    <span
                        className="h-2.5 w-2.5 animate-bounce rounded-full bg-current"
                        style={{ animationDelay: '0ms' }}
                    />
                    <span
                        className="h-2.5 w-2.5 animate-bounce rounded-full bg-current"
                        style={{ animationDelay: '150ms' }}
                    />
                    <span
                        className="h-2.5 w-2.5 animate-bounce rounded-full bg-current"
                        style={{ animationDelay: '300ms' }}
                    />
                </div>
                {/* <p className="meta-text">{label}</p> */}
            </div>
        </div>
    );
}
