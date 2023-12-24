import * as FileSystem from 'expo-file-system';
import { FFmpegKit, FFmpegKitConfig, ReturnCode, FFprobeKit } from 'ffmpeg-kit-react-native';



// export interface projJSON {
//     id: string;
//     name: string;
//     desc: string;
//     thumbnail: string;
//     numVideos: number;  // 0-indexed. 0 means no vids stored, 1 means 1 vid stored (with val of 0)
// }



export class Project {
    id;
    name;
    desc;
    thumbnail;
    numVideos;

    constructor(id, name, desc, thumbnail, numVideos) {
        this.id = id;
        this.name = name;
        this.desc = desc;
        this.thumbnail = thumbnail;
        this.numVideos = numVideos;
    }


    // nv: video number
    generateFileName(vn) {
        return `${FileSystem.documentDirectory}pola-P${this.id}-V${vn}.mov`;
    }


    async addVideo(originURI) {
        await FFmpegKitConfig.init();
        
        const destinationURI = this.generateFileName(this.numVideos);
        try {
            await FFmpegKit.execute(`-y -i ${originURI} -vf "scale=2160:3840:force_original_aspect_ratio=decrease,pad=2160:3840:(ow-iw)/2:(oh-ih)/2:black" -r 30 -c:a copy -b:v 20M ${destinationURI}`);
            this.numVideos++;
            console.log('Video copied to local storage:', destinationURI);
        } catch (err) {
            console.error('Error copying video:', err);
        }
    }

    async updateVideo(idx, originURI) {
        try {
            await FileSystem.deleteAsync(this.generateFileName(idx));
            await FileSystem.copyAsync({ from: originURI, to: this.generateFileName(idx) })
        }
        catch (err) { console.error('Error replacing video:', err); }
    }

    async deleteVideo(idx) {
        try { await FileSystem.deleteAsync(this.generateFileName(idx)); }
        catch (err) { console.error('Error deleting video:', err); }
        for (let i=idx+1; i<this.numVideos; i++) {
            try { await FileSystem.moveAsync({ from: this.generateFileName(i), to: this.generateFileName(i-1) }); }
            catch (err) { console.error('Error renaming video in deletion process:', err)}
        }
        this.numVideos--;
    }


    getThumbnail() {
        if (!this.thumbnail) return '';
        return this.thumbnail;
    }

    async updateThumbnail(originURL) {
        const destinationURI = `${FileSystem.documentDirectory}pola-P${this.id}-thumbnail.png`;
        try {
            await FileSystem.moveAsync({ from: originURL, to: destinationURI });
            this.thumbnail = `${FileSystem.documentDirectory}pola-P${this.id}-thumbnail.png`;
            console.log('Properly updated thumbnail:', destinationURI);
        } catch (err) {
            console.error('Error updating thumbnail:', err);
        }
    }


    async updateOrder(data) {
        const dir = FileSystem.documentDirectory;
        try {
            for (let i=0; i<this.numVideos; i++) {
                if (i != data[i].idx) await FileSystem.moveAsync({ from: this.generateFileName(data[i].idx), to: `${dir}temp${i}.mov` });
            }
            for (let i=0; i<this.numVideos; i++) {
                if (i != data[i].idx) await FileSystem.moveAsync({ from: `${dir}temp${i}.mov`, to: this.generateFileName(i) });
            }
        } catch (err) {
            console.error('Error reording videos:', err);
        }
    }


    async makeStitch() {
        const output = `${FileSystem.documentDirectory}output.mov`;
        let oRes = await FileSystem.getInfoAsync(output);   if (oRes.exists) await FileSystem.deleteAsync(output);
        const temp = `${FileSystem.documentDirectory}temp.mov`;
        let tRes = await FileSystem.getInfoAsync(temp);   if (tRes.exists) await FileSystem.deleteAsync(temp);
        
        await FFmpegKit.execute(`-y -i ${this.generateFileName(0)} -c:v copy ${temp}`);

        for (let i=1; i<this.numVideos; i++) {
            await FFmpegKit.execute(`-y -i ${temp} -i ${this.generateFileName(i)} -filter_complex "[0:v][0:a][1:v][1:a]concat=n=2:v=1:a=1[vout][aout]" -map "[vout]" -map "[aout]" -c:v h264 -c:a aac -b:v 20M -b:a 1M -vsync 2 ${output}`);
            
            let res = await FileSystem.getInfoAsync(temp);   if (res.exists) await FileSystem.deleteAsync(temp);
            FileSystem.copyAsync({from: output, to: temp});
        }
        await FileSystem.deleteAsync(temp);
        return output;
    }


    async destructor() {
        // Delete vids
        for (let i=0; i<this.numVideos; i++) {
            try { await FileSystem.deleteAsync(this.generateFileName(i)); }
            catch (err) { console.error('Error deleting file:', err); }
        }
        // Delete thumbnail
        if (this.thumbnail) await FileSystem.deleteAsync(this.getThumbnail());
    }
}