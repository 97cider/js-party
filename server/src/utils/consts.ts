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
    static readonly ExtraSuffixes = ['(FULL ALBUM)', '(full album)', '(Full Album)', 'MusicVideo', 
                                     'MUSIC VIDEO', '[MV]' ,'「MV」', '【MV】', 'MV', '【Music Video】', '(Official Video)',
                                     'Full Album', '[Full Album]', '(Official Music Video)',
                                     '【ENG SUB】', 
    ];

    static readonly RegexSuffixes = [ /((Ending)\s+[0-9]+\s?(Full)?)/gi, ];
    static readonly SongDividers = ['-', '|', ' _ '];
}