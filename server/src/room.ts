import { Console } from 'console';
import { reduceEachTrailingCommentRange } from 'typescript';
import ProgressionType = require('./ProgressionType');

const webSocket = require('ws');
const { TypeUtils } = require('./utils/typeParser');

class Room {
    ws: any | undefined;
    wss: any | undefined;
    clients: Object[];
    mediaQueue: string[];
    biasedMediaQueue: string[];
    mediaState: boolean;
    activeUrl: string | undefined;
    currentTime: number | undefined;
    timeCandidates: number[];
    queueIndex: number;
    isLooping: boolean | undefined;
    progressionType: ProgressionType;

    constructor() {
        this.clients = [];
        this.mediaQueue = [];
        this.mediaState = false;
        this.timeCandidates = [];
        this.queueIndex = 0;
        this.progressionType = ProgressionType.Linear;
        this.biasedMediaQueue = [];
    }

    printClients() {
        this.clients.forEach(element => {
            console.log(`Client Name: ${element}`);
        });
    }

    toggleVideoState() {
        console.log('Pausing the current room song?');
        this.mediaState = !this.mediaState;
        this.wss.clients.forEach((ws : any) => {
            console.log('HEY WE ARE SENDING THE TOGGLE BACK TO THE CLIENT');
            ws.send(JSON.stringify({ actionType: 'ToggleVideo', state: this.mediaState }));
        });
    }

    playYoutubeVideo(url : string)
    {
        let urlType = TypeUtils.parseUrl(url);
        let updatedUrl = url;
        console.log(`Determined the URL type: ${urlType}`);
        if (urlType == 'youtube') {
            console.log('Hey a youtube video!');
            updatedUrl = TypeUtils.getIdFromYoutubeUrl(url);
        }
        else {
            console.log('Not a youtube video!');
        }
        this.activeUrl = updatedUrl;
        console.log(`Set the active URL to ${updatedUrl}`);
        this.wss.clients.forEach((ws : any) => {
            ws.send(JSON.stringify({ actionType: 'PlayYoutubeVideo', url: updatedUrl }));
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

    ComputeSyncTime() {
        let maxTime = Math.max(...this.timeCandidates);
        console.log(`Syncing videos with a max time of ${maxTime} from a list of length ${this.timeCandidates.length}`);
        this.SyncVideos(maxTime);
    }

    SyncVideos(time : number) {
        this.wss.clients.forEach((ws : any) => {
            ws.send(JSON.stringify({ actionType: 'VideoSync', time: time, url: this.activeUrl }));
        });
        this.timeCandidates = [];
    }

    AddVideoUrlToQueue(url : string) {
        this.mediaQueue.push(url);
        this.biasedMediaQueue.push(url);
        // TODO: eventual callbacks for adding a video to a queue
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
            this.toggleVideoState();
            return;
        }
        if (actionType === 'SyncVideo') {
            console.log('Got video times through Sync...Sending Messages Back');
            this.timeCandidates.push(action.time);
            if(this.timeCandidates.length >= 2) {
                console.log('...COMPUTING TIME SYNC...');
                this.ComputeSyncTime();
            }
        }
        if (actionType === 'ModifyRoomSettings')
        {
            // hey they modified the room settings
            this.modifyRoomConfiguration(action.options);
        }
        if (actionType === 'AddSongToQueue') 
        {
            this.AddVideoUrlToQueue(action.url);
        }
        if (actionType === 'EndVideo') {
            this.navigateToNextSong();
        }
    }

    navigateToNextSong() {
        console.log(`PROGRESSION TYPE THROUGH ENUM ${ProgressionType[this.progressionType]}`);
        // navigate to the next song depending on the progression type of the room
        if (this.progressionType == ProgressionType.BiasedRandom) {
            console.log("LOADING VIDEO WITH BIASED RANDOM PROGRESSION");
            this.biasedMediaQueue.splice(this.queueIndex, 1);
            this.queueIndex = Math.floor(Math.random() * this.biasedMediaQueue.length);
            this.playYoutubeVideo(this.biasedMediaQueue[this.queueIndex]);
            return;
        }
        if (this.progressionType == ProgressionType.FullyRandom) {
            console.log("LOADING VIDEO WITH FULLY RANDOM PROGRESSION");
            this.queueIndex = Math.floor(Math.random() * this.mediaQueue.length);
        }
        else {
            //basic progression (linearlly)
            console.log("LOADING VIDEO WITH LINEAR PROGRESSION");
            if (this.activeUrl == this.mediaQueue[this.queueIndex]) {
                this.queueIndex++;
            }
            console.log(this.queueIndex);
            console.log(this.mediaQueue.length);
        }
        
        // reset the queue index
        if (this.queueIndex >= this.mediaQueue.length) {
            if (this.isLooping) {
                this.queueIndex = 0;
            }
            else {
                return;
            }
        }
        console.log("Hey a song ended!");
        this.playYoutubeVideo(this.mediaQueue[this.queueIndex]);
    }

    modifyRoomConfiguration(options : any) {
        console.log('Hey we modified the room settings');
        let progression : keyof typeof ProgressionType = options.progressionType;

        this.progressionType = ProgressionType[progression];
        this.isLooping = options.isLooping;

        console.log(`New Room Settings: isLooping ${this.isLooping} ProgressionType: ${this.progressionType} from a key ${progression} and value ${options.progressionType}`)

        this.wss.clients.forEach((ws : any) => {
            ws.send(JSON.stringify({ actionType: 'ModifyRoomSettings', options: {
                progressionType: this.progressionType,
                isLooping: this.isLooping
            }}));
        });
    }
}

export = Room;