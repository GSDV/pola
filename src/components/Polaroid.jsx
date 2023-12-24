import { StyleSheet, Text, View, Image } from 'react-native';



export default function Polaroid(props) {
    const { proj } = props;
    const thumbnail = proj.getThumbnail();
    let thumbnailIMG;

    if (!thumbnail) thumbnailIMG = <Image style={{ width: 140, height: 140 }} source={require('@assets/thumbnail.png')} />;
    else thumbnailIMG = <Image style={{ width: 140, height: 140 }} source={{ uri: thumbnail }} />;

    return (
        <View style={[ styles.polaroid ]}>
            {thumbnailIMG}
            <Text numberOfLines={1} style={[ styles.text ]}>{proj.name}</Text>
        </View>
    );
}



const styles = StyleSheet.create({
    polaroid: {
        padding: 10,
        width: 160,
        flexDirection: 'column',
        alignItems: 'center',
        backgroundColor: 'white',
        borderBottomLeftRadius: 10,
        borderBottomRightRadius: 10,
        borderTopLeftRadius: 10,
        borderTopRightRadius: 10,
        shadowColor: 'black',
        shadowOpacity: 0.5,
        shadowRadius: 10
    },
    text: {
      margin: 5,
      marginBottom: 0,
      fontSize: 17,
      textAlign: 'center',
      color: 'black'
    },
});