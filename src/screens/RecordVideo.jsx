import { StyleSheet, Text, View, Pressable } from 'react-native';
import { useEffect, useState } from 'react';
import { Camera as NativeCamera } from 'expo-camera';
import Camera from '@components/RecordVideo/Camera';
import ReviewVideo from '@components/RecordVideo/ReviewVideo';
import SafeArea from '@components/SafeArea';

import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

import ThemeStyles from '@util/styles/theme.js';



export default function RecordVideo() {
    const [hasCameraPermission, setHasCameraPermission] = useState<boolean>(false);
    const [hasMicrophonePermission, setHasMicrophonePermission] = useState<boolean>(false);

    const [video, setVideo] = useState();

    useEffect(() => {
        const getPermissions = async () => {
            const cameraPermission = await NativeCamera.requestCameraPermissionsAsync();
            const microphonePermission = await NativeCamera.requestMicrophonePermissionsAsync();

            setHasCameraPermission(cameraPermission.status === "granted");
            setHasMicrophonePermission(microphonePermission.status === "granted");
        }
        getPermissions();
    }, []);


    return (
    <>
        {(() => {
            if (hasCameraPermission === undefined || hasMicrophonePermission === undefined) return <ErrorMessage msg='Requesting permissions...' />;
            else if (!hasCameraPermission) return <ErrorMessage msg='Permission for camera not granted.' />;
            
            if (video) return (
                <SafeArea>
                    <RecordVideoHeader />
                    <ReviewVideo video={video} setVideo={setVideo} />

                </SafeArea>
            );
            else return <Camera setVideo={setVideo} />;
        })()}
    </>
    );
}


function ErrorMessage(msg) {
    return (
        <SafeArea>
            <RecordVideoHeader />
            <View style={styles.errorView}>
                <Text style={styles.errorText}>{msg}</Text>
            </View>
        </SafeArea>
    )
}


function RecordVideoHeader() {
    const router = useRouter();
    const themeStyles = ThemeStyles();

    return (
        <View style={[ styles.header, themeStyles.secondaryBG ]}>
            <Pressable onPress={router.back} style={{ marginLeft: `5%`}}>
                <Ionicons name={'chevron-back'} size={30} style={{ color: 'white' }} />
            </Pressable>
        </View>
    );
}



const styles = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: 'column'
    },
    video: {
      flex: 1,
      alignSelf: "stretch"
    },

    header: {
        width: '100%',
        padding: 5,
        paddingBottom: 10
    },

    errorView: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'black'
    },
    errorText: {
        color: 'white',
        fontSize: 20,
        textAlign: 'center'
    }
});