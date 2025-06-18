"use client";

import TemplateMessagesTable from "@/components/tables/TemplateMessagesTable";
import { useRouter } from 'next/navigation';

const TemplateMessages = () => {

    const router = useRouter();

    return (
        <div>
            <TemplateMessagesTable/>
        </div>
    );
}

export default TemplateMessages;