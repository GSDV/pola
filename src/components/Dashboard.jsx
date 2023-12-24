import { View, Text, Pressable, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

import { useContext } from 'react';
import { ThemeContext } from '@util/settings/ThemeContext';
import ThemeStyles from '@util/styles/theme';




export function Dashboard(props) {
    const { buttons, disabled } = props;
    const themeContext = useContext(ThemeContext);
    const themeStyles = ThemeStyles();
    const bgColor = themeContext.darkMode ? '#383838' : '#bdbdbd'

    return (
        <View style={[ styles.dashboard, { backgroundColor: bgColor } ]}>
        {disabled ?
        <>
            <Pressable style={[ styles.dashboardPressables, {opacity: 0.3} ]}>
                <Ionicons name={buttons[0].icon} size={50} style={ themeStyles.text } />
                <Text style={[ themeStyles.text, {fontSize: 15} ]}>{buttons[0].title}</Text>
            </Pressable>

            <Pressable style={[ styles.dashboardPressables, {opacity: 0.3} ]}>
                <Ionicons name={buttons[1].icon} size={50} style={ themeStyles.text } />
                <Text style={[ themeStyles.text, {fontSize: 15} ]}>{buttons[1].title}</Text>
            </Pressable>
        </>
        :
        <>
            <Pressable onPress={buttons[0].action} style={ styles.dashboardPressables }>
                <Ionicons name={buttons[0].icon} size={50} style={ themeStyles.text } />
                <Text style={[ themeStyles.text, {fontSize: 15} ]}>{buttons[0].title}</Text>
            </Pressable>

            <Pressable onPress={buttons[1].action} style={ styles.dashboardPressables }>
                <Ionicons name={buttons[1].icon} size={50} style={ themeStyles.text } />
                <Text style={[ themeStyles.text, {fontSize: 15} ]}>{buttons[1].title}</Text>
            </Pressable>
        </>
        }
        </View>
    );
}



const styles = StyleSheet.create({
    dashboard: {
        padding: 20,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    dashboardPressables: {
        flexDirection: 'column',
        alignItems: 'center',
    }
});