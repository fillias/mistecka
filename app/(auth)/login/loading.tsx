// loading.tsx
import Spinner from '../../UI/Spinner';
export default function Loading() {
    return (
        <div className="page-stack">
            <div className="card">
                <div className="flex items-start justify-between gap-4">
                    <div className="w-full">
                        <Spinner label="přihlašuji" />
                    </div>
                </div>
            </div>
        </div>
    );
}
