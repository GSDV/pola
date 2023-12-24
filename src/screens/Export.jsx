import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Header } from '@components/Header';

import { useContext, useEffect, useState, useRef } from 'react';
import { ProjectManagerContext } from '@util/project-lib/ProjectManagerContext.jsx';

import { useRouter, useGlobalSearchParams } from 'expo-router';

import LoadingSymbol from '@components/LoadingSymbol';

import { Video, Audio, ResizeMode } from 'expo-av';
import ThemeStyles from '@util/styles/theme.js';

import * as FileSystem from 'expo-file-system';

import * as MediaLibrary from 'expo-media-library';



export default function Export() {
    const themeStyles = ThemeStyles();

    const pmContext = useContext(ProjectManagerContext);

    const params = useGlobalSearchParams();
    const projPos = Number(params.projPos);
    const proj = pmContext.pm.projects[projPos];


    const [stitchRequested, setStitchRequest] = useState(false);
    const [finaluri, setFinalURI] = useState('');
    const [loading, setLoading] = useState(true);

    const getStitch = async () => {
        setStitchRequest(true);
        let uri = await proj.makeStitch();
        setFinalURI(uri);
        setLoading(false);
    }
    
    return (
    <>
        <ExportHeader />
        <View style={ styles.container }>
            {(proj.numVideos < 2) ?
                <Text style={[ styles.text, styles.error ]}>You need to upload two or more videos to make a stitch.</Text>
            :
                <>
                    {!stitchRequested ?
                        <Pressable onPress={() => getStitch()}>
                            <Text style={[ themeStyles.secondaryBG, styles.text, styles.button ]}>Make Stitch</Text>
                        </Pressable>
                    :
                        <VidPlayer loading={loading} finaluri={finaluri} />
                    }
                </>
            }
        </View>
    </>
    );
}



function ExportHeader() {
    const router = useRouter();
    let buttons = [
        { isMenu: false, icon: 'chevron-back', action: router.back }
    ];
    return ( <Header title="Stitched Video" buttons={buttons} /> );
}


function VidPlayer(props) {
    const { loading, finaluri } = props
    const themeStyles = ThemeStyles();

    const video = useRef(null);
    const [status, setStatus] = useState({});
    const triggerAudio = async () => {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        video.current.playAsync();
    };

    const saveStitchToDevice = async () => {
        const stitchURI = `${FileSystem.documentDirectory}output.mov`;
        await MediaLibrary.saveToLibraryAsync(stitchURI);
        console.log("Success!")
    }

    useEffect(() => {
        if (status.isPlaying) triggerAudio();
    }, [status.isPlaying]);

    return (
        <View style={styles.container}>
            {loading ?
                <LoadingSymbol title='Stitching Video...' loadingMsg='This may take a few minutes. Please do not close the app or navigate away from this screen.' />
            :
                <>
                    <Video
                        ref={video}
                        source={{uri: finaluri}}
                        useNativeControls
                        style={{width: 300, height: 500}}
                        resizeMode={ResizeMode.COVER}
                        onPlaybackStatusUpdate={(status) => setStatus(status)}
                    />
                    <Pressable onPress={ saveStitchToDevice }>
                        <Text style={[ themeStyles.secondaryBG, styles.text, styles.button ]}>Save Video</Text>
                    </Pressable>
                </>
            }
        </View>
    );
}




const styles = StyleSheet.create({
    container: {
        padding: 20,
        flex: 1,
        gap: 20,
    },
    text: {
        padding: 20,
        overflow: 'hidden',
        alignSelf: 'center',
        borderRadius: 20,
        fontSize: 15,
        color: 'white',
        textAlign: 'center',
    },
    error: {
        backgroundColor: 'red',
    },
});