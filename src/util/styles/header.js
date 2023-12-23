import { StyleSheet } from "react-native";


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
        width: '65%'
    }
});

export default headerStyles;