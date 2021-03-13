// soundcloud url to use song names/url and stuff that should work?
// https://w.soundcloud.com/player/?url=
export class Constants {
    static readonly YoutubePrefixes = {
        type: 'youtube',
        prefixes: ['youtube.com', 'youtu.be']
    };
    static readonly SoundCloudPrefixes = {
        type: 'soundcloud',
        prefixes: ['w.soundcloud.com', 'soundcloud.com']
    };
    static readonly ExtraSuffixes = ['MV', '(FULL ALBUM)', '(full album)', 'MusicVideo', 
                                     'MUSIC VIDEO', '「MV」', '【MV】', '【Music Video】',
                                     'Full Album', '[Full Album]', '(Official Music Video)',
                                     '【ENG SUB】', 
    ];

    static readonly RegexSuffixes = [ /((Ending)\s+[0-9]+\s?(Full)?)/gi, ];
    static readonly SongDividers = ['-', '|'];
}