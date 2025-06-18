"use client";

import SettingWebTable from "@/components/tables/SettingWebTable";
import { useRouter } from 'next/navigation';

interface IpWhitelistProps {
  user: any;
}

const TemplateMessages = ({ user }: IpWhitelistProps) => {

    const router = useRouter();
    console.log();

    return (
        <div>
            <SettingWebTable />
        </div>
    );
}

export default TemplateMessages;