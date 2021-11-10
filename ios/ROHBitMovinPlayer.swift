//
//  ROHBitMovinPlayer.swift
//  RohTVApp
//
//  Created by Eyevinn on 2021-11-10.
//

import Foundation
import UIKit
import AVFoundation

@objc(ROHBitMovinPlayer)
class ROHBitMovinPlayer: RCTViewManager {
    var playerView: ViewController?
    @objc(multiply:withB:withResolver:withRejecter:)
    func multiply(a: Float, b: Float, resolve:RCTPromiseResolveBlock,reject:RCTPromiseRejectBlock) -> Void {
        resolve(a*b)
    }

    override func view() -> UIView! {
      playerView = ViewController()
      return playerView;
    }

    override static func requiresMainQueueSetup() -> Bool {
        return true
    }

    @objc(play)
    func play() -> Void {
        playerView?.play()
    }

    @objc(pause)
    func pause() -> Void {
        playerView?.pause()
    }

    @objc(destroy)
    func destroy() -> Void {
        playerView?.destroy()
    }

    @objc(seekBackwardCommand)
    func seekBackwardCommand() -> Void {
        playerView?.seekBackwardCommand()
    }

    @objc(seekForwardCommand)
    func seekForwardCommand() -> Void {
        playerView?.seekForwardCommand()
    }
}
