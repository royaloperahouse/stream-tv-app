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
    var analyticsCollector: BitmovinPlayerCollector? = nil
    private var config: BitmovinAnalyticsConfig

  required init?(coder aDecoder: NSCoder) {
      config = BitmovinAnalyticsConfig(key: "45a0bac7-b900-4a0f-9d87-41a120744160")
      config.cdnProvider = CdnProvider.bitmovin
      config.customData1 = "customData1"
      config.customData2 = "customData2"
      config.customData3 = "customData3"
      config.customData4 = "customData4"
      config.customData5 = "customData5"
      config.customerUserId = "customUserId"
      config.experimentName = "experiment-1"
      config.videoId = "tvOSHLSStatic"
      config.path = "/vod/breadcrumb/"

      analyticsCollector = BitmovinAnalytics(config: config)
      super.init(coder: aDecoder)
  }

    let playerConfig = PlayerConfig()
    let playbackConfig = PlaybackConfig()

    deinit {
        player?.destroy()
    }
}


