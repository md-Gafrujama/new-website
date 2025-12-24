"use client";

import { createContext, useContext, useState, useEffect } from 'react';

const DarkModeContext = createContext(undefined);

export const useDarkMode = () => {
  const context = useContext(DarkModeContext);
  if (context === undefined) {
    throw new Error('useDarkMode must be used within DarkModeProvider');
  }
  return context;
};

export const DarkModeProvider = ({ children }) => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // Check localStorage for saved preference
    const savedTheme = localStorage.getItem('theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    
    const initialDarkMode = savedTheme ? savedTheme === 'dark' : prefersDark;
    setIsDarkMode(initialDarkMode);
    
    // Apply immediately - use requestAnimationFrame to ensure DOM is ready
    requestAnimationFrame(() => {
      const html = document.documentElement;
      if (initialDarkMode) {
        html.classList.add('dark');
        html.style.colorScheme = 'dark';
        console.log('🌙 Dark mode enabled on mount - HTML has dark class:', html.classList.contains('dark'));
      } else {
        html.classList.remove('dark');
        html.style.colorScheme = 'light';
        console.log('☀️ Light mode enabled on mount');
      }
    });
  }, []);

  useEffect(() => {
    if (!mounted) return;
    
    // Update localStorage
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    
    // Update document class immediately - use requestAnimationFrame for smooth update
    requestAnimationFrame(() => {
      const html = document.documentElement;
      if (isDarkMode) {
        html.classList.add('dark');
        html.style.colorScheme = 'dark';
        console.log('🌙 Dark mode applied - HTML class:', html.classList.contains('dark'), 'HTML element:', html);
      } else {
        html.classList.remove('dark');
        html.style.colorScheme = 'light';
        console.log('☀️ Light mode applied');
      }
    });
  }, [isDarkMode, mounted]);

  const toggleDarkMode = () => {
    setIsDarkMode(prev => {
      const newValue = !prev;
      // Apply immediately for instant feedback - use requestAnimationFrame
      requestAnimationFrame(() => {
        const html = document.documentElement;
        if (newValue) {
          html.classList.add('dark');
          html.style.colorScheme = 'dark';
          localStorage.setItem('theme', 'dark');
          console.log('🌙 Dark mode toggled ON - HTML class:', html.classList.contains('dark'), 'All classes:', html.className);
        } else {
          html.classList.remove('dark');
          html.style.colorScheme = 'light';
          localStorage.setItem('theme', 'light');
          console.log('☀️ Dark mode toggled OFF');
        }
      });
      return newValue;
    });
  };

  const setDarkMode = (value) => {
    setIsDarkMode(value);
  };

  const value = {
    isDarkMode,
    toggleDarkMode,
    setDarkMode,
    mounted,
  };

  return (
    <DarkModeContext.Provider value={value}>
      {children}
    </DarkModeContext.Provider>
  );
};

