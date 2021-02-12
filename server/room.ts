class Room {
    ws: Object;
    clients: Object[];
    
    mediaQueue: Object[];

    constructor(ws: Object) {
        this,ws = ws;
    }

    navigateToNextSong(progression: ProgressionType, isLooping: boolean) {
        // navigate to the next song depending on the progression type of the room
        console.log("Hey a song ended!");
    }
}