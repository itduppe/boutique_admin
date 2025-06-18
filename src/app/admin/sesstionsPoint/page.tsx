"use client";

import SesstionsPointTable from "@/components/tables/SesstionsPointTable";
import { useRouter } from 'next/navigation';

const User = () => {
    const router = useRouter();

    return (
        <div>
            <SesstionsPointTable />
        </div>
    );
}

export default User;