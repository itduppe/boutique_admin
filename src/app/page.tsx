"use client";

import { useEffect, useState } from 'react';
import { useRouter } from "next/navigation";

export default function HomePage() {
    const [token, setToken] = useState("");
    const [checkingAuth, setCheckingAuth] = useState(true);
    const router = useRouter();

    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
        }
        setCheckingAuth(false);
    }, []);

    useEffect(() => {
        if (checkingAuth && token) {
            router.replace("/admin");
        } else {
            router.replace("/login");
        }
    }, []);

    return null;
}