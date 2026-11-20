import { getMistecka } from '@/lib/db/nav';
import DashboardNavClientMobileHP from './DashboardNavClientMobileHP';

export default async function DashboardNav() {
    const mistecka = await getMistecka();

    return <DashboardNavClientMobileHP mistecka={mistecka} />;
}
