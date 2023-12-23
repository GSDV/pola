import { StyleSheet, View, Pressable } from 'react-native';
import { useState, useRef } from 'react';
import { Camera as NativeCamera, CameraType } from 'expo-camera';

import { Ionicons } from '@expo/vector-icons';

import { useRouter } from 'expo-router';

import ThemeStyles from '@util/styles/theme';




export default function Camera(setVideo) {
    const router = useRouter();

    const [camDirection, setCamDirection] = useState(true);
    const toggleCamDirection = () => {setCamDirection(!camDirection)}

    const buttons = [
        { icon: 'chevron-back', action: router.back },
        { icon: 'sync', action: toggleCamDirection }
    ];

    let cameraRef = useRef(null);
    const [isRecording, setIsRecording] = useState(false);

    const recordVideo = async () => {
        setIsRecording(true);
        let options = {
            mute: false
        };
        if (cameraRef.current) {
            await cameraRef.current.recordAsync(options).then((recordedVideo) => {
                setVideo(recordedVideo);
                setIsRecording(false);
            });
        }
    };
    
    const stopRecording = () => {
        setIsRecording(false);
        if (cameraRef.current) cameraRef.current.stopRecording();
    };


    return (
            <NativeCamera
                style={ styles.camera }
                ref={cameraRef}
                type={camDirection ? CameraType.back : CameraType.front}
                ratio='16:9'
            >
                <Buttons isRecording={isRecording} recordVideo={recordVideo} stopRecording={stopRecording} buttons={buttons} />
            </NativeCamera>
    );
}



function Buttons(isRecording, recordVideo, stopRecording, buttons) {
    const themeStyles = ThemeStyles();

    return (
            <View style={ styles.buttonContainer }>
                {!isRecording && <Pressable style={styles.button} onPress={buttons[0].action}>
                    <Ionicons name={buttons[0].icon} size={30} style={{ color: 'white' }} />
                </Pressable>}

                <Pressable onPress={isRecording ? stopRecording : recordVideo}>
                    <Ionicons name={isRecording ? 'md-stop-circle-outline' : 'md-ellipse-outline'} size={100} style={ themeStyles.secondary } />
                </Pressable>

                {!isRecording && <Pressable style={styles.button} onPress={buttons[1].action}>
                    <Ionicons name={buttons[1].icon} size={30} style={{ color: 'white' }} />
                </Pressable>}
            </View>
    );
}



const styles = StyleSheet.create({
    camera: {
        flex: 1,
        paddingBottom: 40,
        justifyContent: 'flex-end',
    },
    buttonContainer: {
        width: '100%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around'
    },
    button: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.3)',
        alignItems: 'center',
        justifyContent: 'center'
    }
});