# Developer setup

We are currently aiming to support Amazon FireStick. Other platforms are preferrably to be supported at any point, but is not a priority.

At the moment the most actual React Native version is `0.64.2`, however versions `0.64.*` have a bug, that Touchable components do not invoke `onFocus` callbacks when focused (which is the only way for us to handle highlughting while navigating via remote control).
https://github.com/facebook/react-native/issues/31391

Thus, the application is currently running `0.63.4`.

## Requirements

 - React Native 0.63.4
 - Node (we use 15.10.0 currently on nvm) 
 - Xcode (we use 12.5.1)
 - Cocoapods (Currently using 1.10.1)
 - Android studio (we use 4.1.2 - 4.2.2)

## Installation

You should be familiar with React Native and mobile development.

We recommend installing Node and Watchman using Homebrew. Run the following commands in a Terminal after installing Homebrew:

`$ brew install node`

`$ brew install watchman`

`$ npm install` or `$ yarn install`

Install Xcode: https://reactnative.dev/docs/environment-setup#xcode

Install CocoaPods:
`$ sudo gem install cocoapods`

In ios directory:
`$ pod install` (you will possibly need to run `$ pod repo update` prior to this)

Java Development Kit:
`$ brew install --cask adoptopenjdk/openjdk/adoptopenjdk8`

Install Android Studio: https://reactnative.dev/docs/environment-setup#installing-dependencies

## Run

Start Metro:
`$ npx react-native start`

### Android

`$ npx react-native run-android`

NB: If you have issues with the emulator hanging, you are probably running macOS Big Sur ;) See https://stackoverflow.com/a/67304587/1861645 for more info. In Android studio, go to `SDK Manager` -> `SDK Tools Tab` -> uncheck `Android Emulator`and Apply, then go back in and re-check the emulator. This will trigger the update that fixes the problem.

_(Status: It is currently possible to run on an Android TV emulator (in fact on an Android emulator, but the experience really own works well on a TV emulator), but there are certain issues. The recommended experience is on an Amazon Fire Stick.)_

#### Current flow for using the app on Android TV Emulator
* Once you have the app running, press the "Getting Started" button on the start screen. 
* You will then be presented with a QR Code login screen.
* You will need to provide your public IP address to ROH so that they can add it to their database.
* Once that is done, you will see a code on-screen (No need to refresh as the login updates regularly). 
* You will then need again to provide this code to ROH. Once they have added it to their database, you will (again, no need to refresh) see and be able to use the rest of the app.

#### Amazon Fire TV

Please follow the steps at Amazon for [connecting to your Fire TV Device](https://developer.amazon.com/docs/fire-tv/connecting-adb-to-device.html)

You should then be able to deploy your React Native app to your device from Android Studio (note that you will need to restart `adb` on occasion)

### IOS

`$ npx react-native run-ios`

_(Status: Will build, but not currently operational)_

### AppleTV

`$ npx react-native run-ios  --simulator "Apple TV" --scheme "StreamTvApp-tvOS"`

_(Status: No target, doesn't exist as yet)_

## Development

### Technologies used:
 - Typescript!
 - Redux: app state
 - Redux-saga: asynchronous side-effects middleware
 - Axios: promise-based http client
 - Prismic: headless CMS
 - Fuse: client-side fuzzy search

### Architecture notes
 There are two main loops in the app, initiated/maintained by sagas:
 
   * the auth login loop
     * updates every 10 secs
     * continues until login is complete
   * the main login loop
     * updates every 30 mins
     * continues throughout app lifetime
     * fetches new content 
