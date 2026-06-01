import userInfo from '@/lib/userInfo';

export default async function LoggedUserEmail() {
    const { email } = await userInfo();

    return <span className="eyebrow">{email}</span>;
}
