// components/DashboardNav.tsx
import { getMistecka } from '@/lib/db/nav';
import DashboardNavClient from './DashboardNavClient';

export default async function DashboardNav() {
    const mistecka = await getMistecka();

    return <DashboardNavClient mistecka={mistecka} />;
}
