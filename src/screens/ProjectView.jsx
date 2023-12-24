import { StyleSheet, Text, View, ActionSheetIOS, Image, ScrollView, Alert } from 'react-native';
import { Header } from '@components/Header';
import { Dashboard } from '@components/Dashboard';

import { useRouter, useGlobalSearchParams } from 'expo-router';

import { useContext, useState, useEffect } from 'react';
import { ProjectManagerContext } from '@util/project-lib/ProjectManagerContext.jsx';

import ThemeStyles from '@util/styles/theme.js';

import * as ImagePicker from 'expo-image-picker';
import * as VideoThumbnails from 'expo-video-thumbnails';


import { DraggableGrid } from 'react-native-draggable-grid';



export default function ProjectView() {
    const [refresher, refresh] = useState(false);

    const themeStyles = ThemeStyles();

    const params = useGlobalSearchParams();
    const projPos = Number(params.position);


    return (
    <>
        <ProjectViewHeader pos={projPos} refresher={refresher} refresh={refresh} />
        <Thumbnail pos={projPos} key={refresher.toString()} />
        <ProjectViewDashboard pos={projPos} />
        <Text style={[ {width: '100%', textAlign: 'center', fontSize: 15, padding: 10}, themeStyles.text ]}>Press and hold to drag videos around</Text>
        <VideoGrid pos={projPos} />
    </>
    );
}



function ProjectViewHeader(props) {
    const { pos, refresher, refresh } = props;
    const router = useRouter();

    const pmContext = useContext(ProjectManagerContext);
    const proj = pmContext.pm.projects[pos];

    const renameProjectAlert = () => Alert.prompt(
        'Rename Project:', '', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Ok', onPress: async (name) => {
                    proj.name = name;
                    await pmContext.saveProjects();
                }, style: 'default' }
        ], 'plain-text', proj.name
    );

    const deleteConfirmationAlert = () => Alert.alert(
        'Are you sure you want to delete this project?', '', [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Yes, delete', onPress: async () => {
                    router.back();
                    await pmContext.pm.deleteProject(pos);
                    await pmContext.saveProjects();
                }, style: 'destructive' }
        ]
    );

    const changeThumbnail = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            quality: 1
        });

        if (!result.canceled) {
            await proj.updateThumbnail(result.assets[0].uri);
            await pmContext.saveProjects();
            refresh(!refresher);
        }
    };



    let options = [
        { isMenu: false, icon: 'chevron-back', action: () => {router.back()} },
        { isMenu: true, menuOptions: [
                { isDestructive: false, title: 'Cancel', action: () => {} },
                { isDestructive: false, title: 'Rename Project', action: renameProjectAlert },
                { isDestructive: false, title: 'Change Thumbnail', action: changeThumbnail },
                { isDestructive: true, title: 'Delete Project', action: deleteConfirmationAlert }
        ] }
    ];
    
    return (<Header title={proj.name} buttons={options} />);
}






function Thumbnail(props) {
    const { pos } = props;
    const pmContext = useContext(ProjectManagerContext);
    const proj = pmContext.pm.projects[pos];

    const thumbnail = proj.getThumbnail();
    let thumbnailIMG;
    if (!thumbnail) thumbnailIMG = <Image style={{ width: 180, height: 180, borderRadius: 10 }} source={require('@assets/thumbnail.png')} />;
    else thumbnailIMG = <Image style={{ width: 180, height: 180, borderRadius: 10 }} source={{ uri: thumbnail }} />;

    return (
        <View style={{ width: '100%', height: 200, justifyContent: 'center', alignItems: 'center' }}>
            {thumbnailIMG}
        </View>
    );
}



function ProjectViewDashboard(props) {
    const { pos } = props;
    const router = useRouter();
    const pmContext = useContext(ProjectManagerContext);
    const proj = pmContext.pm.projects[pos];


    const exportVid =  () => { router.push(`/project/export?projPos=${pos}`); }

    const openCamera = async () => { router.push(`/project/camera?projPos=${pos}`) }
    const pickImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Videos,
            allowsEditing: true,
            quality: 1
        });

        if (!result.canceled) {
            await proj.addVideo(result.assets[0].uri);
            await pmContext.saveProjects();
        }
    };

    const actions = [() => {}, openCamera, pickImage]
    const addMediaOptions = () => ActionSheetIOS.showActionSheetWithOptions(
            {
                options: ['Cancel', 'Open Camera', 'Open Video Library'],
                cancelButtonIndex: 0,
            },
            (idx) => {actions[idx]()}
        );
    
    const buttons = [
        { title: 'Export Video', icon: 'download-outline', action: exportVid },
        { title: 'Add Videos', icon: 'camera-outline', action: addMediaOptions }
    ];


    return ( <Dashboard buttons={buttons} /> );
}





function VideoGrid(props) {
    const { pos } = props;
    const pmContext = useContext(ProjectManagerContext);
    const proj = pmContext.pm.projects[pos];
    
    const [vidData, setVidData] = useState([]);
    const [dragging, setDragging] = useState(false);

    useEffect(() => {
        let ogVidData = [];
        for (let i=0; i<proj.numVideos; i++) {
            ogVidData.push({
                idx: i,
                key: `k-${i}`,
                uri: proj.generateFileName(i)
            });
        }
        setVidData(ogVidData);
    }, [proj.numVideos]);

    const updateVidData = async (data) => {
        await proj.updateOrder(data);
        for (let i=0; i<proj.numVideos; i++) data[i].idx = i;
        setVidData(data);
        pmContext.saveProjects();
    }


    return (
        <ScrollView scrollEnabled={!dragging}>
            <DraggableGrid
                key={proj.numVideos}
                projIdx={pos}
                numColumns={3}
                renderItem={( item ) => (<View><GridImage vidURI={item.uri} key={item.key}></GridImage></View>)}
                data={vidData}
                onDragStart={() => { setDragging(true); }}
                onDragRelease={(data) => {
                    updateVidData(data);
                    setDragging(false);
                }}
            />
        </ScrollView>
    );
}




function GridImage(props) {
    const { vidURI } = props;
    const themeStyles = ThemeStyles();

    const [image, setImage] = useState(null);
    const generateVideoThumbnail = async () => {
        try {
            const { uri } = await VideoThumbnails.getThumbnailAsync(vidURI, {time: 0});
            setImage(uri);
        } catch (e) {
            console.warn(e);
        }
    };

    useEffect(() => {
        generateVideoThumbnail();
    }, []);


    return (
        <View style={[ gridStyles.imageView, themeStyles.secondaryBG ]}>
            <Image source={{ uri: image }} style={gridStyles.image} />
        </View>
    );
}



const gridStyles = StyleSheet.create({
    imageView: {
        width: 120,
        height: 120,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 10
    },
    image: {
        width: 110,
        height: 110,
        borderRadius: 7
    }
});