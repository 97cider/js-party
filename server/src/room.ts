import ProgressionType = require('./ProgressionType');

const webSocket = require('ws');

class Room {
    ws: any | undefined;
    clients: Object[];
    mediaQueue: Object[] | undefined;
    mediaState: boolean;

    constructor() {
        this.clients = [];
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

    // Takes in an action type defined by the 
    // messageevent returned from the websocket server
    parseAction(actionType : string) {
        console.log(`PARSING: ${actionType}`);
        switch(actionType) {
            case 'PauseVideo': {

            }
            case 'ResumeVideo': {

            }
            case 'ToggleVideo': {
                console.log("HEY WE ARE TOGGLING THE VIDEO!");
                this.mediaState = !this.mediaState;
                this.ws.send('HEY WE TOGGLED THE VIDEO FOR THESE SPECIFIC USERSSS');
            }
            default: {

            }
        }
    }

    navigateToNextSong(progression: ProgressionType, isLooping: boolean) {
        // navigate to the next song depending on the progression type of the room
        console.log("Hey a song ended!");
    }
}

export = Room;