import React, { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import { ConfigProvider, theme } from 'antd';

export type ThemeColor = 'orange' | 'blue' | 'yellow' | 'green';
export type ThemeMode = 'light' | 'dark';

interface ThemeContextType {
    color: ThemeColor;
    mode: ThemeMode;
    setColor: (color: ThemeColor) => void;
    setMode: (mode: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useTheme must be used within a ThemeProvider');
    }
    return context;
};

const colorMap = {
    orange: '#fa8c16',
    blue: '#1677ff',
    yellow: '#faad14',
    green: '#52c41a',
};

export const AppThemeProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [color, setColor] = useState<ThemeColor>('orange'); // Default to orange
    const [mode, setMode] = useState<ThemeMode>('light'); // Default to light

    useEffect(() => {
        // Load saved theme from local storage if available
        const savedColor = localStorage.getItem('themeColor') as ThemeColor;
        const savedMode = localStorage.getItem('themeMode') as ThemeMode;
        if (savedColor) setColor(savedColor);
        if (savedMode) setMode(savedMode);
    }, []);

    const handleSetColor = (newColor: ThemeColor) => {
        setColor(newColor);
        localStorage.setItem('themeColor', newColor);
    };

    const handleSetMode = (newMode: ThemeMode) => {
        setMode(newMode);
        localStorage.setItem('themeMode', newMode);
    };

    return (
        <ThemeContext.Provider value={{ color, mode, setColor: handleSetColor, setMode: handleSetMode }}>
            <ConfigProvider
                theme={{
                    algorithm: mode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm,
                    token: {
                        colorPrimary: colorMap[color],
                        fontFamily: `'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif`,
                        borderRadius: 8,
                    },
                    components: {
                        Button: {
                            primaryShadow: '0 2px 0 rgba(0, 0, 0, 0.045)',
                        }
                    }
                }}
            >
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};
