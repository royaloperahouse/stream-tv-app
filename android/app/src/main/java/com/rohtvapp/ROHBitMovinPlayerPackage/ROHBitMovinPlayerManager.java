package com.rohtvapp.ROHBitMovinPlayerPackage;

import android.content.pm.PackageManager;
import android.content.pm.ApplicationInfo;

import android.util.Log;

import com.bitmovin.analytics.BitmovinAnalyticsConfig;
import com.bitmovin.analytics.bitmovin.player.BitmovinPlayerCollector;
import com.bitmovin.analytics.enums.CDNProvider;
import com.bitmovin.player.PlayerView;
import com.bitmovin.player.SubtitleView;
import com.bitmovin.player.api.PlaybackConfig;
import com.bitmovin.player.api.Player;
import com.bitmovin.player.api.PlayerConfig;
import com.bitmovin.player.api.event.PlayerEvent;
import com.bitmovin.player.api.event.SourceEvent;
import com.bitmovin.player.api.media.subtitle.SubtitleTrack;
import com.bitmovin.player.api.source.Source;
import com.bitmovin.player.api.source.SourceConfig;
import com.bitmovin.player.api.media.LabelingConfig;
import com.bitmovin.player.api.vr.VrConfig;
import com.bitmovin.player.api.source.SourceOptions;
import com.bitmovin.player.api.source.SourceType;
import com.bitmovin.player.api.ui.StyleConfig;
import com.bitmovin.player.ui.CustomMessageHandler;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import java.util.ArrayList;

public class ROHBitMovinPlayerManager extends SimpleViewManager<PlayerContainerView> {

  public static final String REACT_CLASS = "ROHBitMovinPlayer";

  private PlayerContainerView playerContainerView;
  private PlayerView playerView;
  private Player player;
  private SubtitleView  subtitleView;
  private ThemedReactContext reactContext;

  private ReadableMap configuration;
  private ReadableMap analyticsConfig;
  private BitmovinPlayerCollector analyticsCollector;
  private PlayerConfig playerConfig = new PlayerConfig();
  private SubtitleTrack subtitleTrack;
  private int heartbeat = 10;
  private boolean nextCallback = false;
  private boolean customSeek = false;
  private double stoppedTime = 0.0;
  private double duration = 0.0;
  private boolean mustAutoPlay = false;

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  public PlayerContainerView createViewInstance(ThemedReactContext context) {
    reactContext = context;
    playerContainerView = new PlayerContainerView(reactContext);
    return playerContainerView;
  }

  @ReactProp(name = "autoPlay")
  public void setAutoPlay(PlayerContainerView view, Boolean autoPlay) {
    if (autoPlay != null) {
      view.setAutoPlay(autoPlay);
    }
  }

  @ReactProp(name = "analytics")
  public void setAnalytics(PlayerContainerView view, ReadableMap analytics) {

    String videoId = "";
    String title = "";
    String userId = "";
    String experiment = "";
    String customData1 = "";
    String customData2 = "";
    String customData3 = "";
    String customData4 = "";
    String customData5 = "";
    String customData6 = "";
    String customData7 = "";

    PackageManager pm = reactContext.getPackageManager();
    String licenseKey = null;
    String analyticsKey = null;

    try {
      ApplicationInfo pInfo = pm.getApplicationInfo(reactContext.getPackageName(), PackageManager.GET_META_DATA);
      licenseKey = pInfo.metaData.getString("BITMOVIN_PLAYER_LICENSE_KEY");
      analyticsKey = pInfo.metaData.getString("BITMOVIN_ANALYTICS_LICENSE_KEY");
    } catch (PackageManager.NameNotFoundException e) {
      e.printStackTrace();
      Log.e("[METADATA]", " name not found");
    }

    BitmovinAnalyticsConfig bitmovinAnalyticsConfig = new BitmovinAnalyticsConfig(
            analyticsKey,
            licenseKey
    );

    if (analytics != null && analytics.getString("videoId") != null) {
      videoId = analytics.getString("videoId");
    }

    if (analytics != null && analytics.getString("title") != null) {
      title = analytics.getString("title");
    }

    if (analytics != null && analytics.getString("userId") != null) {
      userId = analytics.getString("userId");
    }

    if (analytics != null && analytics.getString("experiment") != null) {
      experiment = analytics.getString("experiment");
    }

    if (analytics != null && analytics.getString("customData1") != null) {
      customData1 = analytics.getString("customData1");
    }

    if (analytics != null && analytics.getString("customData2") != null) {
      customData2 = analytics.getString("customData2");
    }

    if (analytics != null && analytics.getString("customData3") != null) {
      customData3 = analytics.getString("customData3");
    }

    if (analytics != null && analytics.getString("customData4") != null) {
      customData4 = analytics.getString("customData4");
    }

    if (analytics != null && analytics.getString("customData5") != null) {
      customData5 = analytics.getString("customData5");
    }

    if (analytics != null && analytics.getString("customData6") != null) {
      customData6 = analytics.getString("customData6");
    }

    if (analytics != null && analytics.getString("customData7") != null) {
      customData7 = analytics.getString("customData7");
    }

    bitmovinAnalyticsConfig.setVideoId(videoId);
    bitmovinAnalyticsConfig.setTitle(title);
    bitmovinAnalyticsConfig.setCustomUserId(userId);
    bitmovinAnalyticsConfig.setCdnProvider(CDNProvider.BITMOVIN);
    bitmovinAnalyticsConfig.setExperimentName(experiment);
    bitmovinAnalyticsConfig.setCustomData1(customData1);
    bitmovinAnalyticsConfig.setCustomData2(customData2);
    bitmovinAnalyticsConfig.setCustomData3(customData3);
    bitmovinAnalyticsConfig.setCustomData4(customData4);
    bitmovinAnalyticsConfig.setCustomData5(customData5);
    bitmovinAnalyticsConfig.setCustomData6(customData6);
    bitmovinAnalyticsConfig.setCustomData7(customData7);

    playerContainerView.setAnalytics(bitmovinAnalyticsConfig, reactContext);
  }

  @ReactProp(name = "configuration")
  public void setConfiguration(PlayerContainerView view, ReadableMap config) {
    ReadableMap configuration = config;

    String url = "";
    String poster = "";
    Double offset = 0.0;
    SourceType type;

    if (configuration != null && configuration.getString("url") != null) {
      url = configuration.getString("url");

      if (configuration.getString("poster") != null) {
        poster = configuration.getString("poster");
      }

      if (configuration.getString("offset") != null) {
        offset = Double.valueOf(configuration.getString("offset"));
      }

      Source source = Source.create(
              new SourceConfig(
                      url,
                      SourceType.Hls,
                      null,
                      null,
                      null,
                      false,
                      new ArrayList(),
                      null,
                      null,
                      new LabelingConfig(),
                      new VrConfig(),
                      new ArrayList(),
                      new ArrayList(),
                      new SourceOptions(offset, null),
                      null
              )
      );

      playerContainerView.configure(source);
    }


    if (configuration != null && configuration.getString("heartbeat") != null) {
      heartbeat = Integer.parseInt(configuration.getString("hearbeat"));
    }
  }
}
