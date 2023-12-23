import { ScrollView, StyleSheet, Pressable, Alert } from 'react-native';
import { Header } from '@components/Header';
import Polaroid from '@components/Polaroid';

import { useContext } from 'react';
import { ProjectManagerContext } from '@util/project-lib/ProjectManagerContext.jsx';

import { useRouter } from 'expo-router';



export default function Home() {
    const router = useRouter();
    const pmContext = useContext(ProjectManagerContext);


    return (
    <>
        <HomeHeader />
        <ScrollView contentContainerStyle={styles.scrollview}>
            {pmContext.pm.projects.map((proj, i)  => (
                <Pressable style={{ margin: 10 }} onPress={() => router.push(`/project?position=${i}`)} key={proj.id}>
                    <Polaroid proj={proj}/>
                </Pressable>
            ))}
        </ScrollView>
    </>
    );
}



function HomeHeader() {
    const router = useRouter();
    const pmContext = useContext(ProjectManagerContext);

    const newProjectAlert = () => Alert.prompt(
        'Enter Project Name:',
        '',
        [
            { text: "Cancel", style: 'cancel' },
            { text: "Ok", onPress: (name) => {pmContext.pm.createNewProj(name); pmContext.saveProjects(); }, style: 'default' }
        ],
        'plain-text'
    );


    let buttons = [
        { isMenu: false, icon: 'ios-settings-outline', action: () => {router.push('/settings');} },
        { isMenu: false, icon: 'add-circle-outline', action: newProjectAlert }
    ];

    return (<Header title="POLA" buttons={buttons} />);
}



const styles = StyleSheet.create({
    scrollview: {
        paddingTop: 10,
        paddingBottom: 150,
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-evenly',
    }
});