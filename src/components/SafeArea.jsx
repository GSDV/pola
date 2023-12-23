import { SafeAreaView, View } from 'react-native';
import ThemeStyles from '@util/styles/theme.js';



export default function SafeArea({ children }) {
    const themeStyles = ThemeStyles();

    return (
    <>
        <SafeAreaView style={ themeStyles.secondaryBG } />
        <View style={[ {flex: 1}, themeStyles.bg ]}>
            {children}
        </View>
    </>
    );
}