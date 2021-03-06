![alt text](https://github.com/97cider/js-party/blob/main/client/public/svgs/LaternPartyLogo.svg?raw=true)

# Lantern Party
Lantern Party is a website made for sharing and syncing music with friends. Currently users can sync and share YouTube and SoundCloud music.
Thats pretty much it at the moment. 

Built using VueJs, Typescript and a hint of ThreeJs for pizzaz. 

## Getting Started

As this is a static application, things are split between a client and a server project. However, both use the same commands to help deploy them for testing.

`npm run rebuild`

This command can be used to deploy the frontend and server for testing. For the frontend, this will package the application and deploy it using serve at wherever configured (presumably localhost).

For the server, this will compile using TypeScript and run the application on the configured port.