import ProgressionType = require('./ProgressionType');

class Room {
    ws: Object | undefined;
    clients: Object[] | undefined;
    
    mediaQueue: Object[] | undefined;

    constructor() {
    }

    navigateToNextSong(progression: ProgressionType, isLooping: boolean) {
        // navigate to the next song depending on the progression type of the room
        console.log("Hey a song ended!");
    }
}

export = Room;