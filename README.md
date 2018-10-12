# Spotify React App

This is an app template bootstrapped with the excellent `create-react-app` tool, which means it has lots of great features and docs out-of-the-box.

What we've done is amend it to make it as simple as possible to develop Spotify apps on top of the Spotify Web API. For example, we provide a tiny `spfetch` helper, which eases OAuth authorization and API communication.

We also provide an example of how to instantiate and interact with the Spotify Web Playback SDK.

The `material-ui` Component library is used to ease on the UI implemenation, since there is unfortunately no publicly available Spotify component library. However, you can of course use build your UI however you wish.

Note: even though this setup is optimised for React apps,

## Installation

To try it out, you'll run `npm install` to install the dependencies, and then `npm start` to start a dev server, which should automatically open `http://localhost:3000` when the app is ready. Any saved code/styling changes will be instantly reflected in your browser.

## Deployment

We've prepared this repo to be used with `now` a powerful yet simple deployment tool which is free for open source usage. It will automatically deploy changes to `master` to your chosen `*.now.sh` url, as well as pull requests to unique staging url:s so you can instantly try out each others PR:s.

The build is driven by the provided `Dockerfile`, which is responsible for setting up the build environment, installing dependencies, building the app and running the tests.

Static apps deployed using `now` is deployed to CloudFlare's global CDN network, meaning you'll have insanely good latency and caching out-of-the-box.

If you need to run a `node` server, `now` can help you there as well, even on their free tier, or you can pick whichever hosting provider you want.
