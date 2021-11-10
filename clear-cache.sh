#!/bin/bash

echo "Clearing react-native cache is starting..."
echo "Clearing watchman is starting..."
watchman watch-del-all
echo "Clearing watchman is finishing"
echo "Clearing node_modules is starting..."
rm -rf node_modules/
rm -rf $TMPDIR/react-native-packager-cache-*
rm -rf $TMPDIR/metro-bundler-cache-*
rm yarn.lock
yarn cache clean —force
yarn install
echo "Clearing node_modules is finishing"
echo "Clearing android gradle is starting..."
cd android
rm -rf .gradle
rm -rf app/build
rm -rf ~/.gradle/caches
./gradlew cleanBuildCache
./gradlew clean
./gradlew tasks
cd ..
echo "Clearing android gradle is finishing"
echo "Clearing iOS pods is starting..."
cd ios
rm Podfile.lock
rm -rf Pods
npx pod-install
echo "Clearing iOS pods is finishing"
echo "Done!"
echo "Metro is starting..."
yarn start --reset-cache