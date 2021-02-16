import ProgressionType = require('./ProgressionType');

class Room {
    ws: Object | undefined;
    clients: Object[];
    mediaQueue: Object[] | undefined;

    constructor() {
        this.clients = [];
        this.mediaQueue = [];
    }

    printClients() {
        this.clients.forEach(element => {
            console.log(`Client Name: ${element}`);
        });
    }

    navigateToNextSong(progression: ProgressionType, isLooping: boolean) {
        // navigate to the next song depending on the progression type of the room
        console.log("Hey a song ended!");
    }
}

export = Room;