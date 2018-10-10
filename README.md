# Spotify React App

This is an app template bootstrapped with the excellent `create-react-app` tool, which means it has lots of great features and docs out-of-the-box. Docs for the `create-react-app` parts can be found [here](CREATE_REACT_APP_README.md).

What we've done is amend the `create-react-app` boilerplate to make it as simple as possible to develop Spotify apps on top of the Spotify Web API. For example, we provide a tiny [spfetch](src/spfetch.js) helper, which eases OAuth authorization and API communication.

We also provide an example of how to instantiate and interact with the Spotify Web Playback SDK.

The [material-ui](https://material-ui.com) Component library is used to ease on the UI implemenation, since there is unfortunately no publicly available Spotify component library. However, you can of course use build your UI however you wish.

Note: even though this setup is optimised for React apps, it can be a good starting point even for a non-React app, since you'd still get value out of all the nice tooling.

## Getting Started

Fork this repo and clone it. Change the [name](package.json#L2) field in [package.json](package.json) to make it your own. Create a a [Spotify Application client id from the Dashboard](https://developer.spotify.com/dashboard/applications) and update it in [config.json](config.json#L2). You should also add `http://localhost:3000/auth.html` and `https://<my-alias-from-now.json>` as Redirect URI:s for the app. If you want to call other endpoints, you may also have tweak the [scope](config.json#L3) key accordingly. Note that the app is built in a way which lets you develop even without adding your own app, but if you don't you'll be at the mercy of the default `client_id` specified 😈

Run `npm install` to install the dependencies, and then `npm start` to start a dev server, which should automatically open `http://localhost:3000` when the app is ready. Any saved code/styling changes will be instantly reflected in your browser.

## Deployment

We've prepared this repo to be used with [now](https://zeit.co/now) – a powerful yet simple deployment tool which is free for open source usage. It will automatically deploy changes to `master` to your chosen `*.now.sh` url, as well as pull requests to unique staging url:s so you can instantly try out each others PR:s (press the ✔️ next to the commit hash).

If you want to set this up for your app, sign up at https://zeit.co and then go to https://zeit.co/github to connect to GitHub and enable it for your repo.

Note that you have to change the [alias](now.json#L3) property in [now.json](now.json) to point to one of your own (you can make one up, as long as it's not already taken), since you won't be able to override our alias.

The build is driven by the provided [Dockerfile](Dockerfile), which is responsible for setting up the build environment, installing dependencies, building the app and running the tests.

Static apps deployed using [now](https://zeit.co/now) is deployed to CloudFlare's global CDN network, meaning you'll have insanely good latency and caching out-of-the-box.

If you need to run a `node` server, [now](https://zeit.co/now) can help you there as well, even on their free tier, or you can pick whichever hosting provider you want.
