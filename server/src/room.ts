import { Console } from 'console';
import { reduceEachTrailingCommentRange } from 'typescript';
import ProgressionType = require('./ProgressionType');

const webSocket = require('ws');

class Room {
    ws: any | undefined;
    wss: any | undefined;
    clients: Object[];
    mediaQueue: Object[] | undefined;
    mediaState: boolean;
    activeUrl: string | undefined;

    constructor() {
        this.clients = [];
        this.mediaQueue = [];
        this.mediaState = false;
    }

    printClients() {
        this.clients.forEach(element => {
            console.log(`Client Name: ${element}`);
        });
    }

    pauseSong(message : any) {
        console.log('Pausing the current room song?');
    }

    playYoutubeVideo(url : string)
    {
        this.activeUrl = url;
        console.log(`Set the active URL to ${url}`);
        this.wss.clients.forEach((ws : any) => {
            ws.send(JSON.stringify({ actionType: 'PlayYoutubeVideo', url: url }));
        });
    }

    BeginVideoSync() {
        // get the average video time from the creator of the room (?)
        // TODO: Flush out room host connection and find a better way of syncing videos
        console.log("Started video sync... Getting Video Time");
        this.wss.clients.forEach((ws : any) => {
            ws.send(JSON.stringify({ actionType: 'GetVideoTime' }));
        });
    }

    SyncVideos(time : number) {
        this.wss.clients.forEach((ws : any) => {
            ws.send(JSON.stringify({ actionType: 'VideoSync', time: time, url: this.activeUrl }));
        });
    }

    // Takes in an action type defined by the 
    // messageevent returned from the websocket server
    parseAction(action : any) {
        let actionType = action.actionType;

        if (actionType === 'PlayYoutubeVideo') {
            console.log("YOOO WE ARE PLAYING A VIDEO!!");
            this.playYoutubeVideo(action.url);
            return;
        }
        if (actionType === 'ToggleVideo') {
            console.log(`HEY WE ARE TOGGLING THE VIDEO! ${actionType}`);
            this.mediaState = !this.mediaState;
            this.wss.clients.forEach((ws : any) => {
                console.log('HEY WE ARE SENDING THE TOGGLE BACK TO THE CLIENT');
                ws.send(JSON.stringify({ actionType: 'ToggleVideo', state: this.mediaState }));
            });
            return;
        }
        if (actionType === 'SyncVideo') {
            console.log('Got video times through Sync...Sending Messages Back');
            this.SyncVideos(action.time);
            return;
        }
    }

    navigateToNextSong(progression: ProgressionType, isLooping: boolean) {
        // navigate to the next song depending on the progression type of the room
        console.log("Hey a song ended!");
    }
}

export = Room;