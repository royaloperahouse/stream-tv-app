//
//  ROHBitMovinPlayer.m
//  RohTVApp
//
//  Created by Eyevinn on 2021-11-10.
//

#import <Foundation/Foundation.h>
#import "React/RCTViewManager.h"
#import <React/RCTBridgeModule.h>

@interface RCT_EXTERN_MODULE(ROHBitMovinPlayer, RCTViewManager)

RCT_EXTERN_METHOD(multiply:(float)a withB:(float)b
                 withResolver:(RCTPromiseResolveBlock)resolve
                 withRejecter:(RCTPromiseRejectBlock)reject)

RCT_EXTERN_METHOD(play)
RCT_EXTERN_METHOD(pause)
RCT_EXTERN_METHOD(destroy)
RCT_EXTERN_METHOD(seekBackwardCommand)
RCT_EXTERN_METHOD(seekForwardCommand)

RCT_EXPORT_VIEW_PROPERTY(autoPlay, BOOL)
RCT_EXPORT_VIEW_PROPERTY(hasZoom, BOOL)
RCT_EXPORT_VIEW_PROPERTY(onReady, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onAirPlay, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onEvent, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onError, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPlay, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onPause, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onSeek, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onForward, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(onRewind, RCTDirectEventBlock)
RCT_EXPORT_VIEW_PROPERTY(configuration, NSDictionary);
RCT_EXPORT_VIEW_PROPERTY(analytics, NSDictionary);

@end
