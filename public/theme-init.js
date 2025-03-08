(function() {
    try {
      // Try to get theme from Zustand storage first
      const storedTheme = localStorage.getItem('theme-storage');
      let theme;
      
      if (storedTheme) {
        try {
          // Parse the Zustand storage
          const themeData = JSON.parse(storedTheme);
          theme = themeData.state?.theme;
        } catch (e) {
          // Fallback if JSON parsing fails
          theme = null;
        }
      }
      
      // If no stored theme, check system preference
      if (!theme) {
        theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
      }
      
      // Apply theme
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        document.documentElement.style.colorScheme = 'dark';
      } else {
        document.documentElement.classList.remove('dark');
        document.documentElement.style.colorScheme = 'light';
      }
    } catch (e) {
      console.error('Theme initialization error:', e);
    }
  })();