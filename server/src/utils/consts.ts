// soundcloud url to use song names/url and stuff that should work?
// https://w.soundcloud.com/player/?url=
export abstract class Constants {
    static readonly YoutubePrefixes = {
        type: 'youtube',
        prefixes: ['youtube.com', 'youtu.be']
    };
    static readonly SoundCloudPrefixes = {
        type: 'soundcloud',
        prefixes: ['w.soundcloud.com', 'soundcloud.com']
    };
}