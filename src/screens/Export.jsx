import { StyleSheet, View, Text, Pressable } from 'react-native';
import { Header } from '@components/Header';

import { useContext, useEffect, useState } from 'react';
import { ProjectManagerContext } from '@util/project-lib/ProjectManagerContext.jsx';

import { useRouter, useGlobalSearchParams } from 'expo-router';

import LoadingSymbol from '@components/LoadingSymbol';

import { Video } from 'expo-av';
import ThemeStyles from '@util/styles/theme.js';



export default function Export() {
    const themeStyles = ThemeStyles();

    const pmContext = useContext(ProjectManagerContext);

    const params = useGlobalSearchParams();
    const projPos = Number(params.projPos);
    const proj = pmContext.pm.projects[projPos];

    const [stitchRequested, setStitchRequest] = useState(false);

    return (
    <>
        <ExportHeader />
        {(proj.numVideos<2) ?
            <Text style={styles.errorText}>You need to upload two or more videos to make a stitch.</Text>
        :
            <>
                {!stitchRequested ?
                    <Pressable style={[ themeStyles.secondaryBG, styles.button ]} onPress={() => setStitchRequest(true)}>
                        <Text>Make Stitch</Text>
                    </Pressable>
                :
                    <VidPlayer />
                }
            </>
        }
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


function VidPlayer() {
    const themeStyles = ThemeStyles();

    const pmContext = useContext(ProjectManagerContext);
    const params = useGlobalSearchParams();
    const projPos = Number(params.projPos);
    const proj = pmContext.pm.projects[projPos];

    const [loading, setLoading] = useState(true);
    const [finaluri, setFinalURI] = useState('');

    const getStitch = async () => {
        let uri = await proj.makeStitch();
        setLoading(false);
        setFinalURI(uri);
    }
    
    useEffect(() => {
        getStitch();
    }, []);

    return (
        <View style={styles.container}>
            {loading ?
                <LoadingSymbol title='Stitching Video...' loadingMsg='This may take a few minutes. Please do not close the app or navigate away from this screen.' />
            :
                <>
                    <Video
                    source={{uri: finaluri}}
                    style={{width: 225, height: 400}}
                    />
                    <View style={styles.dashboard}>
                        {/* <Pressable style={[ styles.button, themeStyles.secondaryBG ]}>Save Video</Pressable> */}
                        <Text style={[ styles.button, themeStyles.secondaryBG ]}>Save Video</Text>
                    </View>
                </>
            }
        </View>
    );
}




const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    button: {
        padding: 10,
        borderRadius: 20,
        color: 'white',
    },
    errorText: {
        margin: 20,
        padding: 20,
        backgroundColor: 'red',
        color: 'white',
        textAlign: 'center',
    },
    dashboard: {
        padding: 10,
        width: '100%',
        backgroundColor: 'yellow'
    }
});