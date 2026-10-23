import { create } from 'zustand';

type ThemeState = {
    darkMode: boolean;
    toggleTheme: () => void;
};

// Sin valor guardado arranca en claro
export const useThemeStore = create<ThemeState>()((set, get) => ({
    darkMode: localStorage.getItem('theme') === 'dark',

    toggleTheme: () => {
        const darkMode = !get().darkMode;
        localStorage.setItem('theme', darkMode ? 'dark' : 'light');
        set({ darkMode });
    },
}));
