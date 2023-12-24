import { Project } from './Project';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';
import AsyncStorage from '@react-native-async-storage/async-storage';



export default class ProjectsManager {
    projects;

    constructor(arr) {
        this.projects = arr;
    }


    async retrieveProjects() {
        this.projects = [];
        try {
            const projectsString = await AsyncStorage.getItem("projArr");
            let projectsJSON = JSON.parse(projectsString ?? "[]");
            projectsJSON.forEach(pJSON => { this.createOldProj(pJSON); });
            console.log('Retrieved array:', this.projects);
        } catch(err) {
            console.error('Error retrieving array:', err);
        }
    }


    async saveProjects() {
        let projectsJSON = [];
        this.projects.forEach(p => {
            projectsJSON.push({
                id: p.id,
                name: p.name,
                thumbnail: p.thumbnail,
                numVideos: p.numVideos
            });
        });
        try {
            const projectsString = JSON.stringify(projectsJSON);
            await AsyncStorage.setItem("projArr", projectsString);
            console.log('Projects stored successfully.');
        } catch (err) {
            console.error('Error storing projects:', err);
        }
    }

    async createNewProj(name) {
        this.projects.push(
            new Project(
                uuidv4(),
                name,
                false,
                0
            )
        );
        await this.saveProjects();
    }

    createOldProj(proj) {
        this.projects.push(
            new Project(
                proj.id, 
                proj.name, 
                proj.thumbnail, 
                proj.numVideos
            )
        );
    }


    async deleteAllProjects() {
        // delete each project separately
        while (this.projects.length) await this.deleteProject(0);
        await this.saveProjects();
    }

    async deleteProject(idx) {
        await this.projects[idx].destructor();
        this.projects.splice(idx, 1);
    }
}
