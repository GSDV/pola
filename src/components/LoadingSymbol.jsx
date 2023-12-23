import { View, ActivityIndicator, StyleSheet, Text } from 'react-native';
import { useContext } from 'react';
import { ColorContext } from '@util/settings/ColorContext.jsx';

import ThemeStyles from '@util/styles/theme.js';



export default function LoadingSymbol(props) {
    const { title, loadingMsg } = props;
    const colorContext = useContext(ColorContext);
    const themeStyles = ThemeStyles();

    return (
        <View style={styles.container}>
            <ActivityIndicator size="large" color={colorContext.secondary} />
            <Text style={[ styles.text, themeStyles.secondary ]}>{title}</Text>
            <Text style={[ styles.text, themeStyles.secondary ]}>{loadingMsg}</Text>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        width: '100%',
        height: 100,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        fontSize: 17
    }
});