import React, { createContext, useState, useEffect, useContext } from 'react';
import { ThemeContext } from '@util/settings/ThemeContext';
import AsyncStorage from '@react-native-async-storage/async-storage';
import getColor from '@util/settings/GetColor';



const ColorContext = createContext({color: 'red', primary: '#FF858E', secondary: '#C02F2F', setColor: () => {}});


const ColorProvider = (props) => {
    const themeContext = useContext(ThemeContext);

    const [color, setColorState] = useState('red');
    const [primary, setPrimary] = useState('#8BBD87');
    const [secondary, setSecondary] = useState('#03A079');


    useEffect(() => {
        const getAsync = async () => {
            try {
                let data = (await AsyncStorage.getItem('color')) ?? 'red';
                if (!['red', 'green', 'blue'].includes(data)) data = 'red';
                setColorState(data);
                setPrimary(getColor(themeContext.darkMode, data, 'primary'));
                setSecondary(getColor(themeContext.darkMode, data, 'secondary'));
            } catch (err) {
                console.error('Error storing user settings in AsyncStorage:', err);
            }
        }
        getAsync();
    }, [themeContext]);


    const setColor = (option) => {
        const setAsync = async (option) => {await AsyncStorage.setItem('color', option); }
        try {
            setAsync(option);
            setColorState(option);
            setPrimary(getColor(themeContext.darkMode, option, 'primary'));
            setSecondary(getColor(themeContext.darkMode, option, 'secondary'));
        }
        catch (err) { console.error('Error storing color in AsyncStorage:', err); }
    }


    return (
    <ColorContext.Provider value={{ color, primary, secondary, setColor }}>
        {props.children}
    </ColorContext.Provider>
    );
};

export { ColorContext, ColorProvider };