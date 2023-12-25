import { View, StyleSheet, Pressable, Text } from 'react-native'
import { Video, ResizeMode } from 'expo-av';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useGlobalSearchParams } from 'expo-router';
import { ProjectManagerContext } from '@util/project-lib/ProjectManagerContext.jsx';
import { useContext, useState } from 'react';

import ThemeStyles from '@util/styles/theme.js';

import LoadingSymbol from '@components/LoadingSymbol';



export default function ReviewVideo(props) {
    const { video, setVideo } = props;
    const [addingVideo, setAddingVideo] = useState(false);

    return (
        <View style={ styles.container }>
            {addingVideo ?
                <View style={styles.addingVid}>
                    <LoadingSymbol title='Encoding and Adding Video' loadingMsg='This may take a few seconds, do not navigate away from this screen.' />
                </View>
            :
            <>
                <Video
                    style={styles.video}
                    source={{ uri: video.uri }}
                    useNativeControls
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping
                />
                <VideoOptions video={video} setVideo={setVideo} setAddingVideo={setAddingVideo} />
            </>
            }
        </View>
    );
}


function VideoOptions(props) {
    const { video, setVideo, setAddingVideo} = props;
    const pmContext = useContext(ProjectManagerContext);
    const themeStyles = ThemeStyles();

    const router = useRouter();
    const params = useGlobalSearchParams();
    const projPos = Number(params.projPos);

    const useVid = async () => {
        setAddingVideo(true)
        await pmContext.pm.projects[projPos].addVideo(video.uri);
        await pmContext.saveProjects();
        setAddingVideo(false)
        router.back();
    }

    const retakeVid = () => {
        setVideo(undefined);
    }

    return (
        <View style={[ styles.option, themeStyles.secondaryBG ]}>
            <VideoOption title='Use Video' icon='checkmark-circle-outline' action={useVid} />
            <VideoOption title='Retake Video' icon='camera-outline' action={retakeVid} />
        </View>
    );
}



function VideoOption(props) {
    const { title, icon, action } = props;

    return (
        <Pressable onPress={action} style={{ flexDirection: 'column', alignItems: 'center' }} >
            <Ionicons name={icon} size={30} style={{ color: 'white' }} />
            <Text style={{ color: 'white', fontSize: 15 }} >{title}</Text>
        </Pressable>
    )
}



const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column',
    },
    video: {
        flex: 1,
    },
    option: {
        width: '100%',
        padding: 10,
        paddingBottom: 30,
        flexDirection: 'row',
        justifyContent: 'space-around'
    },
    addingVid: {
        padding: 20,
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});