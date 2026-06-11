// app/login/loading.tsx
import Spinner from '@/app/UI/Spinner';

export default function Loading() {
    return (
        <div className="flex items-center justify-center min-h-[70vh] gap-3">
            <h1>Přihlašuji...</h1>
            <Spinner />
        </div>
    );
}
