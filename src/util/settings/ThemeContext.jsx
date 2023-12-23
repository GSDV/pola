import React, { createContext, useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';



const ThemeContext = createContext({darkMode: false, setDarkMode: () => {}});


const ThemeProvider = (props) => {
    const [darkMode, setContext] = useState(false);

    useEffect(() => {
        const getAsync = async () => {
            try {
                const data = (await AsyncStorage.getItem('theme'));
                setContext(data=='dark');
            } catch (err) {
                console.error('Error storing theme in AsyncStorage:', err);
            }
        }
        getAsync();
    }, []);


    const setDarkMode = (option) => {
        const setAsync = async (option) => {
            if (option) await AsyncStorage.setItem('theme', 'dark');
            else await AsyncStorage.setItem('theme', 'light');
        }
        try {
            setAsync(option);
            setContext(option);
        }
        catch (err) { console.error('Error storing theme in AsyncStorage:', err); }
    }

    return (
    <ThemeContext.Provider value={{ darkMode, setDarkMode }}>
        {props.children}
    </ThemeContext.Provider>
    );
};

export { ThemeContext, ThemeProvider };