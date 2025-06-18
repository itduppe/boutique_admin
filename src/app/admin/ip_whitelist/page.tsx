"use client";

import IpWhiteList from "@/components/tables/IpWhiteListTable";
import { useRouter } from 'next/navigation';

interface IpWhitelistProps {
  user: any;
}

const IpWhitelist = ({ user }: IpWhitelistProps) => {

    const router = useRouter();
    console.log();

    return (
        <div>
            <IpWhiteList user = {user}/>
        </div>
    );
}

export default IpWhitelist;