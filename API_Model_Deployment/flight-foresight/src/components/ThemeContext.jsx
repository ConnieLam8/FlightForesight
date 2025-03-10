import React, { createContext, useState } from 'react';

// Create the context
export const ThemeContext = createContext(null);

// Create a provider component
export const ThemeProvider = ({ children }) => {
    const [theme, setTheme] = useState('light'); // Example state for the theme

    return (
        <ThemeContext.Provider value={{ theme, setTheme }}>
            {children}
        </ThemeContext.Provider>
    );
};