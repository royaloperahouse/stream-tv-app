# Developer setup

We are currently aiming to support Amazon FireStick. Other platforms are preferrably to be supported at any point, but is not a priority.

At the moment the most actual React Native version is `0.64.2`, however versions `0.64.*` have a bug, that Touchable components do not invoke `onFocus` callbacks when focused (which is the only way for us to handle highlighting while navigating via remote control).
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

We recommend installing Node and Watchman using Homebrew. Run the following commands in a terminal after installing Homebrew:

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

## Getting started using the app on devices and emulators/simulators
* Once you have the app running, press the "Getting Started" button on the start screen. 
* You will then be presented with a QR Code login screen.
* You will need to provide your public IP address to ROH so that they can add it to their database.
* Once that is done, you will see a code on-screen (No need to refresh as the login updates regularly). 
* You will then need again to provide this code to ROH. Once they have added it to their database, you will (again, no need to refresh) see and be able to use the rest of the app.

### Android

`$ npx react-native run-android`

NB: If you have issues with the emulator hanging, you are probably running macOS Big Sur ;) See https://stackoverflow.com/a/67304587/1861645 for more info. In Android studio, go to `SDK Manager` -> `SDK Tools Tab` -> uncheck `Android Emulator`and Apply, then go back in and re-check the emulator. This will trigger the update that fixes the problem.

_(Status: It is currently possible to run on an Android TV emulator (in fact on an Android emulator, but the experience really only works well on a TV emulator), but there are certain issues. The recommended experience is on an Amazon Fire Stick.)_

#### Amazon Fire TV

Please follow the steps at Amazon for [connecting to your Fire TV Device](https://developer.amazon.com/docs/fire-tv/connecting-adb-to-device.html)

You should then be able to deploy your React Native app to your device from Android Studio (note that you will need to restart `adb` on occasion)

### IOS

`$ npx react-native run-ios`

_(Status: Will build, but not currently operational)_

### AppleTV

`$ npx react-native run-ios  --simulator "Apple TV" --scheme "RohTvApp-tvOS"`

Follow the getting started follow described above.

NB: If you need to refresh/restart the app at any point, hold down the space bar until you see the debug menu and choose 'reload'

## Development

### Feature flags

All new features should be developed under feature flags. We use [flagged](https://github.com/sergiodxa/flagged).
Consult the documentation for more details but in short:

First, we wrap our `App` component in flagged's `FeatureProvider`, defining flags in an object prop:

```
    <FlagsProvider features={{ hasOpera: false }}>
        <AppLayout />
    </FlagsProvider>
```

Then, consume the feature flag in the code in question, typically to switch in/out a component, for example:

```
const OperaMusicScreen: React.FC<TOperaMusicScreenProps> = () => {
  const hasOpera = useFeature('hasOpera');
  console.log("hasOpera: ", hasOpera);
  return (
    <View style={styles.root}>
      { 
        hasOpera ?
          <RohText style={styles.rootText} bold>
            Opera & Music Screen is here!
          </RohText> :
          <RohText style={styles.rootText} bold>
            Opera & Music Screen coming soon
          </RohText>
      }
    </View>
  );
};
```

There are also many full-featured feature flag services available such as [flagsmith](https://flagsmith.com) and [flagship](https://developers.flagship.io). These can be used to extend the existing provider functionality. Flagged can recieve either an array of flags or an object with flag keys and values. This fact enables us to prepare the flags elsewhere - for example, perhaps via flagship's Decision API. In this way, we can handle the same feature in various systems simultaneously.

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

Please note that we fetch a list of videos from Prismic in `store\videos\Sagas.ts`(`getVideoListLoopWorker()`). This list is filtered first by selecting videos from the Events store and selecting those with `isBroken` set to false, then further cross-referenced to the fetched list of videos filtered on video_type "performance". (In `General.tsx`). This result will be an array. In production the array should only contain one "performance" video, so we fetch the first element. There may be extra "performance" videos in the staging environment however.