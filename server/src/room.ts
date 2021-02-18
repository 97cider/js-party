import { reduceEachTrailingCommentRange } from 'typescript';
import ProgressionType = require('./ProgressionType');

const webSocket = require('ws');

class Room {
    ws: any | undefined;
    wss: Object[];
    clients: Object[];
    mediaQueue: Object[] | undefined;
    mediaState: boolean;

    constructor() {
        this.clients = [];
        this.wss = [];
        this.mediaQueue = [];
        this.mediaState = true;
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
        this.wss.forEach((ws : any) => {
            ws.send(JSON.stringify({ actionType: 'PlayYoutubeVideo', url: url }));
        });
    }

    // Takes in an action type defined by the 
    // messageevent returned from the websocket server
    parseAction(action : any) {
        let actionType = action.actionType;
        console.log(`PARSING: ${actionType}`);
        if (actionType === 'PlayYoutubeVideo') {
            console.log("YOOO WE ARE PLAYING A VIDEO!!");
            this.playYoutubeVideo(action.url);
            return;
        }
        if (actionType === 'ToggleVideo') {
            console.log(`HEY WE ARE TOGGLING THE VIDEO! ${actionType}`);
            this.mediaState = !this.mediaState;
            this.wss.forEach((ws : any) => {
                ws.send(JSON.stringify({ actionType: 'ToggleVideo', state: this.mediaState }));
            });
            return;
        }
    }

    navigateToNextSong(progression: ProgressionType, isLooping: boolean) {
        // navigate to the next song depending on the progression type of the room
        console.log("Hey a song ended!");
    }
}

export = Room;