"use client";

import OrderTable from "@/components/tables/OrderTable";
import { useRouter } from 'next/navigation';

const IpWhitelist = () => {

    const router = useRouter();
    console.log();

    return (
        <div>
            <OrderTable />
        </div>
    );
}

export default IpWhitelist;