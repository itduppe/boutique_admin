"use client";

import ReviewTable from "@/components/tables/ReviewTable";
import { useRouter } from 'next/navigation';

const User = () => {
    const router = useRouter();

    return (
        <div>
            <ReviewTable />
        </div>
    );
}

export default User;