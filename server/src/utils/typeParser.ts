// Parses a URL and returns a string based on the type of url provided
// Prefixes and mappings can be found in consts.js
// Should 

const { YoutubePrefixes, SoundCloudPrefixes } = require('./consts');

let mappings = [YoutubePrefixes, SoundCloudPrefixes];

const parseUrl = (url : string) => {
    mappings.forEach(prefixType => {
        prefixType.prefixes.array.forEach((prefix : string) => {
            if (url.includes(prefix)) {
                return prefixType.type;
            }
        });
    });
}

module.exports = parseUrl;