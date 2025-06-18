"use client";

import UserTable from "@/components/tables/UserTable";
import { useRouter } from 'next/navigation';

const User = () => {
    const router = useRouter();

    return (
        <div>
            <UserTable />
        </div>
    );
}

export default User;