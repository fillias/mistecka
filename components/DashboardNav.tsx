// components/DashboardNav.tsx
import { getMistecka } from '@/lib/db/nav';
import DashboardNavClient from './DashboardNavClient';
import { headers } from 'next/headers';

export default async function DashboardNav() {
    const mistecka = await getMistecka();
    const headersList = await headers();
    const device = headersList.get('x-device') ?? 'd';

    return <DashboardNavClient mistecka={mistecka} device={device} />;
}
