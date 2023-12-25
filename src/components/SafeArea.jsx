import { View } from 'react-native';
import ThemeStyles from '@util/styles/theme.js';
import { useSafeAreaInsets } from 'react-native-safe-area-context';


export default function SafeArea({ children }) {
    const themeStyles = ThemeStyles();
    const insets = useSafeAreaInsets();

    return (
    <>
        <View
            style={[{
                paddingTop: insets.top,
                paddingLeft: insets.left,
                paddingRight: insets.right,
            }, themeStyles.secondaryBG]}
        />
        <View style={[ {flex: 1}, themeStyles.bg ]}>
            {children}
        </View>
    </>
    );
}