import { OutputFileType } from "typescript";
import { Media } from "../Media";
import MediaType from "../MediaType";

const { Constants } = require('./consts');

const axios = require('axios');

  /*
   * A collection of static classes  that generate supplemental song / playlist information 
   * for the user
   */
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

    // for now get &list=PLRYkrZNliuMlCmni1WKgXiP8ze9WMzzg3 from url
    static tryParsePlaylistURL = async(url: string) => {
        let playlistItems = [];
        if (url.includes('?list=')) {
            const index = url.indexOf('?list=')
            let listId = url.substr(index + 6, url.length);

            // Remove any trailing url params
            // const secondaryIndex = listId.indexOf('?');
            // if (secondaryIndex === -1) {
            //     listId = listId.substr(0, secondaryIndex);
            // }
            console.log(`GETTING PLAYLIST INFORMATION WITH ID ${listId}`);
            playlistItems = await SongInformation.getPlaylistInformation(listId, 'youtube', 25);
        }
        return playlistItems;
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
                songName = newTitle.substring(divIndex + divider.length, newTitle.length);
            }
        });
        if (artistName != '') {
            return { songName: songName, artistName: artistName };
        }
        return { songName : songName };
    }

    // TODO: Definitely work on a better decoupling system for accessing different API data
    // Add a SongInformation router that routes to different methods based on the source (youtube, soundcloud, etc)
    static getPlaylistInformation = async(id : string, type: string, page: number) : Promise<any[]> => {
        let youtubeAccessUrl = `https://youtube.googleapis.com/youtube/v3/playlistItems?part=snippet%2CcontentDetails&maxResults=25&playlistId=${id}&key=${process.env.youtubeAPIKey}`;
        let response = await axios.get(youtubeAccessUrl);
        let items = response.data.items;
        let outputItems : any[] = [];

        if (items === undefined)
        {
            return outputItems;
        }

        console.log(items);
        items.forEach((element : any) => {
            let snippet = element.snippet;
            let id = element.contentDetails.videoId;
            let mediaTitle = snippet.title;
            let thumbnail;
            if(!snippet.thumbnails.default)
            {
                thumbnail = 'public/svgs/icon-missing-thumbnail.svg';
            }
            else
            {
                thumbnail = snippet.thumbnails.default.url;
            }
            outputItems.push({
                id: id,
                title: mediaTitle,
                thumbnail: thumbnail
            })
        });

        return outputItems;
    }

    // Makes an api call to either YouTube or Soundcloud, and returns a populated media object
    static getSongInformation = async (id : string, type: string, url: string): Promise<Media> => {
        console.log(`******* VIDEO ID:${id}***************`);
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
                console.log(videoData.snippet.thumbnails);
                media.thumbnailUrl = videoData.snippet.thumbnails.standard.url;
            })
            .catch((error : any) => {
                console.error(error);
            });
        }
        console.log(` Returned Video title is ${media.title}`);
        return media;
    }
}