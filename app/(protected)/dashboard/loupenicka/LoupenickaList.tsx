import { getNavigationData } from '@/lib/db/nav';
import Link from 'next/link';

export default async function LoupenickaList() {
    const data = await getNavigationData();
    const loupenicka = data.loupenicka;

    return (
        <div className="grid gap-4">
            {loupenicka.map((item) => (
                <Link
                    key={item.id}
                    href={`/dashboard/loupenicka/${item.slug}`}
                    className="card transition hover:bg-black/5"
                >
                    <h3 className="text-lg font-semibold">{item.name}</h3>
                </Link>
            ))}
        </div>
    );
}
