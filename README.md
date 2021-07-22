# ROH TV app

A TV app for Royal Opera House stream, implemented in React Native. 

## Background

We are currently aiming to support Amazon FireStick.
Other platforms are preferrably to be supported at any point, but is not a priority.

At the moment the most actual React Native version is `0.64.2`, however versions `0.64.*` have a bug, that Touchable components do not invoke `onFocus` callbacks when focused (which is the only way for us to handle highlughting while navigating via remote control).
https://github.com/facebook/react-native/issues/31391

Thus, the application is currently running `0.63.4`

## Installation

It is expected the person to install this is familiar with React Native and mobile development.

We recommend installing Node and Watchman using Homebrew. Run the following commands in a Terminal after installing Homebrew:

`$ brew install node`

`$ brew install watchman`

`$ npm install` or `$ yarn install`

Install Xcode: https://reactnative.dev/docs/environment-setup#xcode

Install CocoaPods:
`$ sudo gem install cocoapods`

In ios directory:
`$ pod install`

Java Development Kit:
`$ brew install --cask adoptopenjdk/openjdk/adoptopenjdk8`

Install Android Studio: https://reactnative.dev/docs/environment-setup#installing-dependencies

## Run

Start Metro:
`$ npx react-native start`

### Android

`$ npx react-native run-android`

### IOS

`$ npx react-native run-ios`

### AppleTV

`$ npx react-native run-ios  --simulator "Apple TV" --scheme "StreamTvApp-tvOS"`

## Development

TODO

## Testing

TODO

## Deployment

TODO