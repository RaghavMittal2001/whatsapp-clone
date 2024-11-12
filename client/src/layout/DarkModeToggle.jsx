import React, { useState, useEffect } from 'react';
import { SunIcon, MoonIcon } from '@heroicons/react/solid';

const DarkModeToggle = () => {
    const [isDarkMode, setIsDarkMode] = useState(true);

    useEffect(() => {
        // Check the user's preference and apply dark mode if necessary
        const darkModePreference = localStorage.getItem('dark-mode') === 'true';
        setIsDarkMode(darkModePreference);
        document.documentElement.classList.toggle('dark', darkModePreference);
    }, []);

    const toggleDarkMode = () => {  
        setIsDarkMode((prevMode) => {
            const newMode = !prevMode;
            localStorage.setItem('dark-mode', newMode);
            document.documentElement.classList.toggle('dark', newMode);
            return newMode;
        });
    };

    return (
        <button
            onClick={toggleDarkMode}
            className="p-2 rounded-full bg-gray-200 dark:bg-gray-800 transition"
            aria-label="Toggle Dark Mode"
        >
            {isDarkMode ? (
                <SunIcon className="w-6 h-6 text-yellow-500" />
            ) : (
                <MoonIcon className="w-6 h-6 text-gray-800" />
            )}
        </button>
    );
};

export default DarkModeToggle;

