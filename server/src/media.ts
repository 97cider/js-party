import MediaType from "./MediaType";

export class Media {
    title: string;
    url: string;
    name: string | undefined;
    artistName: string | undefined;
    albumName: string | undefined;
    thumbnailUrl: string | undefined;
    length: number | undefined;
    mediaType: MediaType;

    constructor(url : string) {
        this.url = url;
        this.title = '';
        this.mediaType = MediaType.youtube;
    }
}