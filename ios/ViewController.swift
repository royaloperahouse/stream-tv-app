//
//  ViewController.swift
//  RohTVApp
//
//  Created by Eyevinn on 2021-11-08.
//

import UIKit
import BitmovinPlayer
import BitmovinAnalyticsCollector

final class ViewController: UIView {

  var player: Player?
  var nextCallback: Bool = false
  var heartbeat: Int = 10
  var analyticsCollector: BitmovinPlayerCollector? = nil
  
  let playerConfig = PlayerConfig()
  let playbackConfig = PlaybackConfig()
  
  var cssUrl:URL? = nil
  var jsUrl:URL? = nil
  
  @objc var hasZoom: Bool = false
  @objc var autoPlay: Bool = false
  @objc var configuration: NSDictionary? = nil
  @objc var analytics: NSDictionary? = nil

  @objc var onReady:RCTDirectEventBlock? = nil
  @objc var onAirPlay:RCTDirectEventBlock? = nil
  @objc var onPlay:RCTDirectEventBlock? = nil
  @objc var onPause:RCTDirectEventBlock? = nil
  @objc var onEvent:RCTDirectEventBlock? = nil
  @objc var onError:RCTDirectEventBlock? = nil
  @objc var onSeek:RCTDirectEventBlock? = nil
  @objc var onForward:RCTDirectEventBlock? = nil
  @objc var onRewind:RCTDirectEventBlock? = nil
  
  required init?(coder aDecoder: NSCoder) {
    fatalError("init(coder:) has not been implemented")
  }

  override init(frame: CGRect) {
    super.init(frame: frame)
    
    var plistDictionary: NSDictionary?
    if let path = Bundle.main.path(forResource: "Info", ofType: "plist") {
        plistDictionary = NSDictionary(contentsOfFile: path)
    }
    
    /**
     * Go to https://github.com/bitmovin/bitmovin-player-ui to get started with creating a custom player UI.
     */
    
    if (plistDictionary!["BitmovinPlayerCss"] != nil) {
      self.cssUrl = URL(string: plistDictionary!["BitmovinPlayerCss"] as! String)!
    }
    if (plistDictionary!["BitmovinPlayerJs"] != nil) {
      self.jsUrl = URL(string: plistDictionary!["BitmovinPlayerJs"] as! String)!
    }
    
//
//    config = BitmovinAnalyticsConfig(key: "45a0bac7-b900-4a0f-9d87-41a120744160")
//    config.cdnProvider = CdnProvider.bitmovin
//    config.customData1 = "customData1"
//    config.customData2 = "customData2"
//    config.customData3 = "customData3"
//    config.customData4 = "customData4"
//    config.customData5 = "customData5"
//    config.customerUserId = "customUserId"
//    config.experimentName = "experiment-1"
//    config.videoId = "tvOSHLSStatic"
//    config.path = "/vod/breadcrumb/"
//
//    analyticsCollector = BitmovinAnalytics(config: config)
  }
  
  deinit {
      player?.destroy()
  }
  
  override func didSetProps(_ changedProps: [String]!) {

    let sourceConfig = SourceConfig(url: URL.init(string: self.configuration!["url"] as! String)!, type: .hls)
    // let source = SourceFactory.create(from: sourceConfig)
      
      if((self.configuration!["poster"]) != nil) {
          sourceConfig.posterSource = URL.init(string: self.configuration!["poster"] as! String)!
      }
      if((self.configuration!["subtitles"]) != nil) {
        let subtitleTrack = SubtitleTrack(url: URL(string: self.configuration!["subtitles"] as! String),
          label: "en",
          identifier: "en",
          isDefaultTrack: false,
          language: "en")
        sourceConfig.add(subtitleTrack: subtitleTrack)
      }
      if((self.configuration!["thumbnails"]) != nil) {
        let thumbnailsTrack = ThumbnailTrack(url: URL(string: self.configuration!["thumbnails"] as! String)!, label: "thumbnails", identifier: "thumbnails", isDefaultTrack: true)
        sourceConfig.thumbnailTrack = thumbnailsTrack
      }

      if((self.configuration!["startOffset"]) != nil) {
        sourceConfig.options.startOffset = self.configuration!["startOffset"] as! TimeInterval
      }

      if((self.configuration!["heartbeat"]) != nil) {
        heartbeat = self.configuration!["heartbeat"] as! Int
      }

      if((self.configuration!["title"]) != nil) {
        sourceConfig.title = self.configuration!["title"] as? String;
      }

      if((self.configuration!["hasNextEpisode"]) != nil) {
          sourceConfig.metadata.addEntries(from: ["hasNextEpisode": self.configuration!["hasNextEpisode"] as! Bool])
      }

      if((self.configuration!["advisory"]) != nil) {
          sourceConfig.metadata.addEntries(from: ["advisory": self.configuration!["advisory"] as Any])
      }

      if((self.configuration!["subtitle"]) != nil) {
        sourceConfig.sourceDescription = self.configuration!["subtitle"] as? String;
      }

      if (self.hasZoom == true){
        //sourceConfig.metadata.addEntries(from: ["hasZoom": self.hasZoom])
        playerConfig.styleConfig.scalingMode = .zoom
      }

      if (self.autoPlay == true){
        playerConfig.playbackConfig.isAutoplayEnabled = true
      }
    
    player = PlayerFactory.create(playerConfig: playerConfig)
    nextCallback = false;

      if(self.analytics != nil) {
          var plistDictionary: NSDictionary?
          if let path = Bundle.main.path(forResource: "Info", ofType: "plist") {
              plistDictionary = NSDictionary(contentsOfFile: path)
            
          }
          // Create a BitmovinAnalyticsConfig using your Bitmovin analytics license key and/or your Bitmovin Player Key
          let configAnalytics:BitmovinAnalyticsConfig = BitmovinAnalyticsConfig(key: plistDictionary!["BitmovinAnalyticsLicenseKey"] as! String, playerKey: plistDictionary!["BitmovinPlayerLicenseKey"] as! String)

          configAnalytics.videoId = self.analytics!["videoId"] as? String;
          configAnalytics.title = self.analytics!["title"] as? String;
          configAnalytics.customerUserId = self.analytics!["userId"] as? String;
          configAnalytics.cdnProvider = self.analytics!["cdnProvider"] as? String;
          configAnalytics.customData1 = self.analytics!["customData1"] as? String;
          configAnalytics.customData2 = self.analytics!["customData2"] as? String;
          configAnalytics.customData3 = self.analytics!["customData3"] as? String;
          configAnalytics.customData4 = self.analytics!["customData4"] as? String;

          // Create a BitmovinAnalytics object using the config just created
          analyticsCollector = BitmovinAnalytics(config: configAnalytics);

          // Attach your player instance
          analyticsCollector!.attachPlayer(player: player!);
      }

  }
  
  func play() -> Void {
      DispatchQueue.main.async { [unowned self] in
          player?.play()
      }
  }

  func seekBackwardCommand() -> Void {
      DispatchQueue.main.async { [unowned self] in
          player?.seek(time: self.player!.currentTime - 10)
      }
  }

  func seekForwardCommand() -> Void {
      DispatchQueue.main.async { [unowned self] in
          player?.seek(time: self.player!.currentTime + 10)
      }
  }

  func pause() -> Void {
      DispatchQueue.main.async { [unowned self] in
          player?.pause()
      }
  }

  func destroy() -> Void {
      DispatchQueue.main.async { [unowned self] in
          player?.destroy()
      }
  }

  func handleAudioSessionCategorySetting() {
      let audioSession = AVAudioSession.sharedInstance()

      // When AVAudioSessionCategoryPlayback is already active, we have nothing to do here
      guard audioSession.category.rawValue != AVAudioSession.Category.playback.rawValue else { return }

      do {
          try audioSession.setCategory(AVAudioSession.Category.playback, mode: AVAudioSession.Mode.moviePlayback)
      } catch {
          print("Setting category to AVAudioSessionCategoryPlayback failed.")
      }
  }

}


