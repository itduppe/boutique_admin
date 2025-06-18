"use client";

import CustomerTable from "@/components/tables/CustomerTable";
import { useRouter } from 'next/navigation';

const User = () => {
    const router = useRouter();

    return (
        <div>
            <CustomerTable />
        </div>
    );
}

export default User;