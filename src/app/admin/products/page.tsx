"use client";

import ProductTable from "@/components/tables/ProductTable";
import { useRouter } from 'next/navigation';

const IpWhitelist = () => {

    const router = useRouter();
    console.log();

    return (
        <div>
            <ProductTable />
        </div>
    );
}

export default IpWhitelist;