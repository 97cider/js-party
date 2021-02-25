// Parses a URL and returns a string based on the type of url provided
// Prefixes and mappings can be found in consts.js
// Should 

const { Constants } = require('./consts');

const mappings = [Constants.YoutubePrefixes, Constants.SoundCloudPrefixes];

export class TypeUtils {
    static parseUrl(url : string) : string {
        let type = "";
        mappings.forEach(prefixType => {
            prefixType.prefixes.forEach((prefix : string) => {
                if (url.includes(prefix)) {
                    console.log(`Found Corresponding Type: ${prefixType.type}`);
                    type = prefixType.type;
                    return type;
                }
            });
        });
        return type;
    }
    static getIdFromYoutubeUrl(url : string) : string {
        // this is probably gonna be a little bit messy, as youtube videos can unfortunately have a bunch of formats
        const shorthandUrl = 'youtu.be';
        const normalUrl = 'youtube.com';
        // shortened 
        if (url.includes(shorthandUrl)) {
            console.log(`Found url with shorthand: ${shorthandUrl}`);
            let shortHand = shorthandUrl + '/';
            let idPos = url.indexOf(shortHand);
            console.log(`${shorthandUrl}/ has returned an index of ${idPos}`);
            return url.substring(idPos + (shorthandUrl.length + 1), url.length);
        }
        if (url.includes(normalUrl)) {
            let idPos = url.indexOf(`v=`);
            let endPos = url.indexOf('&');
            if (!endPos) {
                return url.substring(idPos+2, url.length);
            }
            return url.substring(idPos+2, endPos);
        }
        return "";
    }
}