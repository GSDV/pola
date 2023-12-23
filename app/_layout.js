import { Slot } from 'expo-router';
import { ProjectManagerProvider } from '@util/project-lib/ProjectManagerContext';
import { ThemeProvider } from '@util/settings/ThemeContext';
import { ColorProvider } from '@util/settings/ColorContext';

export default function Layout() {
    return (
        <ThemeProvider>
        <ColorProvider>
        <ProjectManagerProvider>
        <Slot />
        </ProjectManagerProvider>
        </ColorProvider>
        </ThemeProvider>
    );
}