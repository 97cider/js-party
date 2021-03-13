// Takes a url and determined type and makes an api call to get some of the the information from the
// target source. Primarilly gets song title and thumbnail

import { Media } from "../Media";
import MediaType from "../MediaType";

const { Constants } = require('./consts');

const axios = require('axios');

export class SongInformation {

    /* Takes in a Title string (currently YouTube only) and **attempts** to remove any unneseccary strings
    *  and return an object of <title, bandName>.
    */

    static stripSuffixes = (title : string) => {
        let strippedTitle = title;
        Constants.ExtraSuffixes.forEach((suffix : string) => {
            if (strippedTitle.includes(suffix)) {
                strippedTitle = strippedTitle.replace(suffix,'');
            }
        });
        Constants.RegexSuffixes.forEach((suffix : RegExp) => {
            if (strippedTitle.match(suffix)) {
                strippedTitle = strippedTitle.replace(suffix,'');
            }
        });
        return strippedTitle;
    }

    static parseSongTitle = (title : string, channelName? : string) => {
        let songName = '';
        let artistName = '';
        let newTitle = SongInformation.stripSuffixes(title);
        Constants.SongDividers.forEach((divider : string) => {
            if (newTitle.includes(divider)) {
                // usally it goes left = songname, right = artist, so we gonna do that
                // actually ive seen it go the otherway more often lol, so we gonna do the other way
                let divIndex = newTitle.indexOf(divider);
                artistName = newTitle.substring(0, divIndex);
                songName = newTitle.substring(divIndex + 1, newTitle.length);
            }
        });
        if (artistName != '') {
            return { songName: songName, artistName: artistName };
        }
        return { songName : songName };
    }

    // Makes an api call to either YouTube or Soundcloud, and returns a populated media object
    static getSongInformation = async (id : string, type: string, url: string): Promise<Media> => {
        let testurl = `https://www.googleapis.com/youtube/v3/videos?id=${id}&key=${process.env.youtubeAPIKey}&part=snippet,contentDetails,statistics,status`;
        let media = new Media(id);
        if (type == 'youtube') {
            await axios.get(testurl)
            .then((response : any) => {
                let videoData = response.data.items[0];
                let mediaTitle = videoData.snippet.title;
                let parsedTitle = SongInformation.parseSongTitle(mediaTitle);

                media.title = mediaTitle;
                media.name = parsedTitle.songName;

                if (parsedTitle.artistName) {
                    media.artistName = parsedTitle.artistName;
                }

                media.mediaType = MediaType[type];
                media.thumbnailUrl = videoData.snippet.thumbnails.high.url;
            })
            .catch((error : any) => {
                console.error(error);
            });
        }
        console.log(` Returned Video title is ${media.title}`);
        return media;
    }
}