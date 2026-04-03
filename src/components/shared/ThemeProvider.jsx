// components/ThemeProvider.jsx
'use client';

import { useEffect, useState } from 'react';
import MainLayoutProvider from '@/components/dashboard/MainLayoutProvider';

export default function ThemeProvider({ children }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    if (!mounted) {
        return (
            <div style={{ visibility: 'hidden' }}>
                <MainLayoutProvider>{children}</MainLayoutProvider>
            </div>
        );
    }

    return <MainLayoutProvider>{children}</MainLayoutProvider>;
}