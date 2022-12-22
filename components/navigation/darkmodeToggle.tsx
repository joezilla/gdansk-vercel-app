import React, { useState, useEffect } from 'react';

/**
 * Initializes dark mode based on browser preference but then also allows
 * toggle and stores the toggle in localStorage.
 * 
 * @returns 
 */
export function DarkmodeToggle() {

    // use React state to manage it all
    const [darkMode, setDarkMode] = React.useState(() => {
        if (typeof window === "undefined") {
            return false;
        }
        if (localStorage.getItem('color-theme') === 'dark' || (!('color-theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
            return true;
        }
        return false;
    }
    );

    // allow toggle
    function handleToggle() {
        setDarkMode(!darkMode);
        if (typeof window !== "undefined") {
            window.localStorage.setItem('color-theme', !darkMode ? 'dark' : 'light');
        } else {
            console.log("Cannot update local storage.");
        }
    }

    // apply theme
    useEffect(() => {
        // console.log(`darkmode: ${darkMode}, localStorage: ${window?.localStorage.getItem('color-theme')}`);
        darkMode ? document.documentElement.classList.add('dark') :
            document.documentElement.classList.remove('dark');
    }, [darkMode ? 'dark' : 'light']);

    // render the icon
    return (
        <button
            id="theme-toggle"
            type="button"
            onClick={handleToggle}
            className="text-gray-500 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none "
        >
            <svg
                id="theme-toggle-dark-icon"
                className={`w-5 h-5 ${darkMode ? '' : 'hidden'}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z"
                ></path>
            </svg>
            <svg
                id="theme-toggle-light-icon"
                className={`w-5 h-5 ${darkMode ? 'hidden' : ''}`}
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
            >
                <path
                    d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z"
                    fillRule="evenodd"
                    clipRule="evenodd"
                ></path>
            </svg>
        </button>
    );
}