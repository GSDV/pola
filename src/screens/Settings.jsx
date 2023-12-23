import { View, Switch, StyleSheet, Text, Pressable, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';

import { ProjectManagerContext } from '@util/project-lib/ProjectManagerContext.jsx';
import { ThemeContext } from '@util/settings/ThemeContext.jsx';
import { ColorContext } from '@util/settings/ColorContext.jsx';
import { useContext, useState } from 'react';

import { useRouter } from 'expo-router';

import ThemeStyles from '@util/styles/theme.js';
import { Header } from '@components/Header';



export default function Settings() {

    return (
    <>
        <SettingsHeader />
        <View style={ styles.container }>

            <View style={[ styles.option ]}>
                <DarkModeOption />
            </View>

            <View style={styles.option}>
                <ColorThemeOption />
            </View>


            <View style={styles.option}>
                <DeleteProjectsOption />
            </View>

        </View>
    </>
    );
}



function SettingsHeader() {
    const router = useRouter();

    let buttons = [
        { isMenu: false, icon: 'chevron-back', action: () => {router.back();} }
    ];
    
    return (<Header title="Settings" buttons={buttons} />);
}



function DarkModeOption() {
    const themeContext = useContext(ThemeContext);
    const themeStyles = ThemeStyles();

    return (
    <>
        <Text style={[ styles.title, themeStyles.text ]}>Dark Mode: </Text>
        <Switch
            value={themeContext.darkMode}
            onValueChange={(val) => {
                themeContext.setDarkMode(val);
            }}
            trackColor={{ false: "#D9DADC", true: "#4ED164" }}
            thumbColor={themeContext.darkMode ? "#fffffff" : "#fffffff"}
            ios_backgroundColor="#D9DADC"
        />
    </>
    );
}



function ColorThemeOption() {
    const themeContext = useContext(ThemeContext);
    const colorContext = useContext(ColorContext);
    const [selectedColor, setSelectedColorState] = useState(colorContext.color);
    const setSelectedColor = (option) => {
        setSelectedColorState(option);
        colorContext.setColor(option);
    }
    const themeStyles = ThemeStyles();

    return (
    <>
        <Text style={[ styles.title, themeStyles.text ]}>Color Theme: </Text>
        <Picker style={{width: 150}}
        selectedValue={selectedColor}
        onValueChange={(val) => setSelectedColor(val)}
        key={String(themeContext.darkMode)}
        itemStyle={[ styles.title, themeStyles.text ]}
        >
            <Picker.Item label="Red" value="red" />
            <Picker.Item label="Green" value="green" />
            <Picker.Item label="Blue" value="blue" />
        </Picker>
    </>
    );
}



function DeleteProjectsOption() {
    const pmContext = useContext(ProjectManagerContext);

    const deleteProjsAlert = () =>  Alert.alert(
        'Are you sure you want to delete all your projects?',
        '',
        [
            { text: "Cancel", style: 'cancel' },
            { text: "Yes, delete", onPress: () => {pmContext.pm.deleteAllProjects()}, style: 'destructive' }
        ]
    );



    return (
        <Pressable onPress={deleteProjsAlert}>
            <Text style={[ styles.title, {color: 'red'} ]}>Delete All Projects</Text>
        </Pressable>
    );
}




const styles = StyleSheet.create({
    container: {
        paddingTop: 50,
        flexGrow: 1,
        flexDirection: 'column',
        gap: 30
    },
    option: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 10
    },
    title: {
        fontSize: 20,
    }
});