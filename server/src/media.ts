import MediaType from "./MediaType";

export class Media {
    title: string;
    url: string;
    name: string | undefined;
    bandName: string | undefined;
    albumName: string | undefined;
    albumIconUrl: string | undefined;
    length: number | undefined;
    mediaType: MediaType | undefined;

    constructor(url : string) {
        this.url = url;
        this.title = '';
    }
}