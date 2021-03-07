// Takes a url and determined type and makes an api call to get some of the the information from the
// target source. Primarilly gets song title and thumbnail

import { Media } from "../Media";
import MediaType from "../MediaType";

const axios = require('axios');

export class SongInformation {

    // TODO: Move to static typed type lol (MediaType.ts)
    static getSongInformation = async (id : string, type: string, url: string): Promise<Media> => {
        let testurl = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${process.env.youtubeAPIKey}&part=snippet,contentDetails,statistics,status`;
        let media = new Media(id);
        if (type == 'youtube') {
            await axios.get(testurl)
            .then((response : any) => {
                let videoData = response.data.items[0];
                let mediaTitle = videoData.snippet.title;
                console.log(`Video title is ${mediaTitle}`);
                media.title = mediaTitle;
                media.mediaType = MediaType[type];
            })
            .catch((error : any) => {
                console.error(error);
            });
        }
        console.log(` Returned Video title is ${media.title}`);
        return media;
    }
}