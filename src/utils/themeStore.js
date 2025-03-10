import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useThemeStore = create(
  persist(
    (set, get) => ({
      theme: typeof window !== 'undefined' 
        ? (localStorage.getItem('theme') || 
          (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light'))
        : 'light',
      
      setTheme: (newTheme) => {
        set({ theme: newTheme });
        applyTheme(newTheme);
      },
      
      toggleTheme: () => {
        const newTheme = get().theme === 'light' ? 'dark' : 'light';
        set({ theme: newTheme });
        applyTheme(newTheme);
      },
      
      listenToSystemThemeChanges: () => {
        const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
        const handleChange = (e) => {
          if (!localStorage.getItem('theme-storage')) {
            const newTheme = e.matches ? 'dark' : 'light';
            set({ theme: newTheme });
            applyTheme(newTheme);
          }
        };
        
        if (mediaQuery.addEventListener) {
          mediaQuery.addEventListener('change', handleChange);
        } else {
          mediaQuery.addListener(handleChange);
        }
        
        return () => {
          if (mediaQuery.removeEventListener) {
            mediaQuery.removeEventListener('change', handleChange);
          } else {
            mediaQuery.removeListener(handleChange);
          }
        };
      }
    }),
    {
      name: 'theme-storage'
    }
  )
);

// Helper function to apply theme to document
function applyTheme(theme) {
  if (typeof window === 'undefined') return;
  
  if (theme === 'dark') {
    document.documentElement.classList.add('dark');
    document.documentElement.style.colorScheme = 'dark';
  } else {
    document.documentElement.classList.remove('dark');
    document.documentElement.style.colorScheme = 'light';
  }
}

// Initialize theme immediately
if (typeof window !== 'undefined') {
  const theme = useThemeStore.getState().theme;
  applyTheme(theme);
}