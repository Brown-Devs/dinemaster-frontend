// stores/useThemeStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

const THEME_KEY = 'vs_theme_mode';

export const useThemeStore = create(
    persist(
        (set, get) => ({
            mode: 'light',
            isHydrated: false,
            setMode: (mode) => {
                try {
                    if (mode === 'dark') {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                } catch (e) {
                    console.error('Error setting theme:', e);
                }
                set({ mode });
            },
            hydrate: () => {
                const currentMode = get().mode;
                try {
                    if (currentMode === 'dark') {
                        document.documentElement.classList.add('dark');
                    } else {
                        document.documentElement.classList.remove('dark');
                    }
                } catch (e) {
                    console.error('Error setting theme:', e);
                }
                set({ isHydrated: true });
            },
        }),
        {
            name: THEME_KEY,
            onRehydrateStorage: () => (state) => {
                state?.hydrate();
            },
        }
    )
);

// Helper function to get initial theme safely
export const getInitialTheme = () => {
    if (typeof window === 'undefined') return 'light';

    try {
        const saved = localStorage.getItem(THEME_KEY);
        if (saved === 'dark' || saved === 'light') {
            return saved;
        }
        if (saved) {
            try {
                const parsed = JSON.parse(saved);
                if (parsed?.state?.mode) {
                    return parsed.state.mode;
                }
            } catch (e) {
                // ignore JSON parse error
            }
        }

        // // If no saved preference, use system preference
        // if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        //     return 'dark';
        // }

        return 'light';
    } catch (e) {
        return 'light';
    }
};