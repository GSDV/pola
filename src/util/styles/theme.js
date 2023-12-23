import { StyleSheet } from 'react-native';
import { useContext } from 'react';
import { ThemeContext } from '@util/settings/ThemeContext';
import { ColorContext } from '@util/settings/ColorContext';



const ThemeStyles = () => {
    const themeContext = useContext(ThemeContext);
    const colorContext = useContext(ColorContext);

    const styles = StyleSheet.create({
        text: { color: (themeContext.darkMode) ? 'white' : 'black' },
        primary: { color: colorContext.primary },
        secondary: { color: colorContext.secondary },
        primaryBG: { backgroundColor: colorContext.primary },
        secondaryBG: { backgroundColor: colorContext.secondary },
        bg: { backgroundColor: (themeContext.darkMode) ? '#262626' : '#dbdbdb' }
    });
    
    return styles;
}


export default ThemeStyles;