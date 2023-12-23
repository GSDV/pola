import React, { createContext, useState, useEffect } from 'react';
import ProjectsManager from '@util/project-lib/ProjectManager';




const ProjectManagerContext = createContext({pm: new ProjectsManager([]), saveProjects: () => {}});


const ProjectManagerProvider = (prop) => {
    const [pm, updatePM] = useState(new ProjectsManager([]));


    useEffect(() => {
        const getAsync = async () => {
            await pm.retrieveProjects();
            updatePM(new ProjectsManager(pm.projects));
        }
        getAsync();
    }, []);

    const saveProjects = async () => {
        const setAsync = async () => {
            await pm.saveProjects();
            updatePM(new ProjectsManager(pm.projects));
        }
        await setAsync();
    }


    return (
    <ProjectManagerContext.Provider value={{ pm, saveProjects }}>
        {prop.children}
    </ProjectManagerContext.Provider>
    );
};

export { ProjectManagerContext, ProjectManagerProvider };