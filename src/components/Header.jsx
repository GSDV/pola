
import { StyleSheet, View, Pressable, Text, ActionSheetIOS } from "react-native";
import { Ionicons } from '@expo/vector-icons';
import ThemeStyles from '@util/styles/theme.js';


export function Header(props) {
    const { title, buttons } = props;
    
    const themeStyles = ThemeStyles();

    let firstButton = null;
    if (buttons.length>0) firstButton = <CustomButton button={buttons[0]} num={0} />

    let secondButton = null;
    if (buttons.length>1) secondButton = <CustomButton button={buttons[1]} num={1} />

    return (
    <>
        <View style={[ headerStyles.container, themeStyles.secondaryBG ]}>
            {firstButton && firstButton}
            <Text numberOfLines={1} style={ headerStyles.text }>{title}</Text>
            {secondButton && secondButton}
        </View>
        <View style={[ themeStyles.primaryBG, {height: 5} ]}></View>
    </>
    );
}



function CustomButton(props) {
    const { num, button } = props

    const themeStyles = ThemeStyles();

    if (!button.isMenu) {
        return (
        <>
            { num===0 ?
            <Pressable onPress={button.action} style={{position: 'absolute', left: `3%`}}>
                <Ionicons name={button.icon} size={40} style={[ themeStyles.primary ]} />
            </Pressable>
            :
            <Pressable onPress={button.action} style={{position: 'absolute', right: `3%`}}>
                <Ionicons name={button.icon} size={40} style={[ themeStyles.primary ]} />
            </Pressable>
            }
        </>
        );
    }


    let optionTitles = button.menuOptions.map(ele => ele.title);
    let destructiveIndices = button.menuOptions.map((ele, idx) => {
        if (ele.isDestructive) return idx;
        return -1;
    }).filter(ele => ele!=-1);

    const onPressMenu = () => {
        ActionSheetIOS.showActionSheetWithOptions(
            {
                options: optionTitles,
                destructiveButtonIndex: destructiveIndices,
                cancelButtonIndex: 0 // Will always be the first element.
            },
            (idx) => { button.menuOptions[idx].action(); }
        );
    }
    return (
        <>
            { num===0 ?
            <Pressable onPress={onPressMenu} style={{position: 'absolute', left: `3%`}}>
                <Ionicons name={'ellipsis-vertical-circle'} size={40} style={[ themeStyles.primary ]} />
            </Pressable>
            :
            <Pressable onPress={onPressMenu} style={{position: 'absolute', right: `3%`}}>
                <Ionicons name={'ellipsis-vertical-circle'} size={40} style={[ themeStyles.primary ]} />
            </Pressable>
            }
        </>
    );
}



const headerStyles = StyleSheet.create({
    container: {
        height: 80,
        flexDirection: 'row',
        justifyContent: 'space-evenly',
        alignItems: 'center'
    },
    text: {
        fontSize: 35,
        color: '#ffffff',
        textAlign: 'center',
        width: '70%'
    }
});