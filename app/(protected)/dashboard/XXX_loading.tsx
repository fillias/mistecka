import Spinner from '@/app/UI/Spinner';

export default function Loading() {
    return (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/35 backdrop-blur-sm">
            <Spinner label="Načítám" />
        </div>
    );
}
