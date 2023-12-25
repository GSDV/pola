import { Alert, View, StyleSheet } from 'react-native';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { Header } from '@components/Header';

import { useContext, useState, useEffect, useRef } from 'react';
import { ProjectManagerContext } from '@util/project-lib/ProjectManagerContext.jsx';

import { Video, Audio, ResizeMode } from 'expo-av'

import * as ImagePicker from 'expo-image-picker';

import { Dashboard } from '@components/Dashboard';

import LoadingSymbol from '@components/LoadingSymbol';



export default function VideoIndex() {
    const [refresher, stateRefresh] = useState(false);
    const refresh = () => stateRefresh(!refresher);
    const [addingVideo, setAddingVideo] = useState(false);

    const params = useGlobalSearchParams();
    const projIdx = Number(params.projIdx);
    const vidIdx = Number(params.vidIdx);

    const pmContext = useContext(ProjectManagerContext);
    const proj = pmContext.pm.projects[projIdx];

    return (
    <>
        <VideoHeader proj={proj} addingVideo={addingVideo} />
        {addingVideo ?
            <View style={styles.addingVid}>
                <LoadingSymbol title='Encoding and Adding Video' loadingMsg='This may take a few seconds, do not navigate away from this screen.' />
            </View>
        :
        <>
            <VideoPlayer key={refresher.toString()} vidIdx={vidIdx} proj={proj} />
            <VideoDashboard refresh={refresh} vidIdx={vidIdx} proj={proj} setAddingVideo={setAddingVideo} />
        </>
        }
    </>
    );
}



function VideoHeader(props) {
    const { proj, addingVideo } = props;
    const router = useRouter();

    
    let options = [
        { isMenu: false, icon: 'chevron-back', action: router.back }
    ];
    
    return (<>
        {addingVideo ?
            <Header title={proj.name} buttons={[]} />
        :
            <Header title={proj.name} buttons={options} />
        }
    </>);
}



function VideoPlayer(props) {
    const { vidIdx, proj } = props
    const video = useRef(null);
    const [status, setStatus] = useState({});
    const triggerAudio = async () => {
        await Audio.setAudioModeAsync({ playsInSilentModeIOS: true });
        video.current.playAsync();
    };

    useEffect(() => {
        if (status.isPlaying) triggerAudio();
        if (status.positionMillis==status.durationMillis && status.isPlaying) video.current.playFromPositionAsync(0);
    }, [status.isPlaying]);

    return (
        <View style={ styles.container }>
            <Video 
                ref={video} 
                source={{ uri: proj.generateFileName(vidIdx) }} 
                useNativeControls 
                style={{ width: 300, height: 350 }} 
                resizeMode={ResizeMode.COVER} 
                onPlaybackStatusUpdate={(status) => setStatus(status)} 
                rate={30} 
            />
        </View>
    );
}



function VideoDashboard(props) {
    const { vidIdx, proj, refresh, setAddingVideo } = props;
    const router = useRouter();
    const pmContext = useContext(ProjectManagerContext);

    const updateVideo = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1
        });

        if (!result.canceled) {
            setAddingVideo(true);
            await proj.updateVideo(vidIdx, result.assets[0].uri);
            await pmContext.saveProjects();
            setAddingVideo(false);
            refresh();
        }
    };
    const updateVideoAlert = () => Alert.alert(
        'Do you want to replace this video?', '', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Yes', onPress: updateVideo }
        ]
    );

    const deleteVideoAlert = () => Alert.alert(
        'Are you sure you want to delete this video?', '', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Yes, delete', onPress: async () => {
                    await proj.deleteVideo(vidIdx);
                    await pmContext.saveProjects();
                    router.back();
                }, style: 'destructive' }
        ]
    );

    const buttons = [
        {
            title: 'Delete Video',
            icon: 'ios-trash-outline',
            action: deleteVideoAlert
        },
        {
            title: 'Change Video',
            icon: 'sync',
            action: updateVideoAlert
        }
    ];

    return ( <Dashboard buttons={buttons} /> );
}




const styles = StyleSheet.create({
    container: {
        padding: 20,
        width: '100%',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    addingVid: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});