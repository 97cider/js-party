// Parses a URL and returns a string based on the type of url provided
// Prefixes and mappings can be found in consts.js
// Should 

const { YoutubePrefixes, SoundCloudPrefixes } = require('./consts');

let mappings = [YoutubePrefixes, SoundCloudPrefixes];

const parseUrl = (url : string) => {
    console.log(YoutubePrefixes);
    mappings.forEach(prefixType => {
        console.log(prefixType);
        prefixType.prefixes.array.forEach((prefix : string) => {
            if (url.includes(prefix)) {
                return prefixType.type;
            }
        });
    });
}

const getIdFromYoutubeUrl = (url : string) => {
    // this is probably gonna be a little bit messy, as youtube videos can unfortunately have a bunch of formats
    const shorthandUrl = 'youtu.be';
    const normalUrl = 'youtube.com';
    // shortened 
    if (url.includes(shorthandUrl)) {
        let idPos = url.indexOf(`${shorthandUrl}/`);
        return url.substring(idPos, url.length);
    }
    if (url.includes(normalUrl)) {
        let idPos = url.indexOf(`v=`);
        let endPos = url.indexOf('&');
        if (!endPos) {
            return url.substring(idPos, url.length);
        }
        return url.substring(idPos, endPos);
    }
}

module.exports = {
    parseUrl,
    getIdFromYoutubeUrl
};