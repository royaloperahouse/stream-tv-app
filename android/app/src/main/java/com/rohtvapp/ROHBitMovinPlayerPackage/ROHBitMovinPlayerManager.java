package com.rohtvapp.ROHBitMovinPlayerPackage;

import android.content.pm.PackageManager;
import android.content.pm.ApplicationInfo;

import android.util.Log;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;

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

import org.json.JSONObject;
import java.util.Map;
import java.util.Arrays;
import java.util.List;
import java.util.ArrayList;

public class ROHBitMovinPlayerManager extends SimpleViewManager<PlayerView> {

  public static final String REACT_CLASS = "ROHBitMovinPlayer";

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
  public PlayerView createViewInstance(ThemedReactContext context) {
    reactContext = context;

    StyleConfig styleConfig = new StyleConfig();
    styleConfig.setUiEnabled(false);

    playerConfig.setStyleConfig(styleConfig);

    player = Player.create(reactContext, playerConfig);

    playerView = new PlayerView(reactContext, player);

    player.on(SourceEvent.Loaded.class, this::onLoad);
    player.on(PlayerEvent.Playing.class, this::onPlay);
    player.on(PlayerEvent.Paused.class, this::onPause);
    player.on(PlayerEvent.Seek.class, this::onSeek);
    player.on(PlayerEvent.TimeChanged.class, this::onTimeChanged);
    player.on(PlayerEvent.Destroy.class, this::onDestroy);
    player.on(PlayerEvent.Seeked.class, this::onSeeked);
    player.on(PlayerEvent.PlaybackFinished.class, this::onPlaybackFinished);
    player.on(PlayerEvent.Ready.class, this::onReady);
    player.on(SourceEvent.Error.class, this::onError);
    player.on(SourceEvent.SubtitleChanged.class, this::onSubtitleChanged);

    return playerView;
  }

  @ReactProp(name = "autoPlay")
  public void setAutoPlay(PlayerView view, Boolean autoPlay) {
    if (autoPlay != null) {
      mustAutoPlay = autoPlay;
    }
  }


  @ReactProp(name = "analytics")
  public void setAnalytics(PlayerView view, ReadableMap analytics) {

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

    BitmovinPlayerCollector analyticsCollector = new BitmovinPlayerCollector(bitmovinAnalyticsConfig, reactContext);

    analyticsCollector.attachPlayer(player);
  }

  @ReactProp(name = "configuration")
  public void setConfiguration(PlayerView view, ReadableMap config) {
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

      player.load(source);

      subtitleView = new SubtitleView(reactContext, null);
      subtitleView.setPlayer(player);
      subtitleView.setUserDefaultStyle();
      subtitleView.setUserDefaultTextSize();
      player.setVolume(100);
    }
  }

  private void onPlay(PlayerEvent.Playing event) {
    WritableMap map = Arguments.createMap();
    map.putString("message", "play");
    map.putString("time", String.valueOf(stoppedTime));
    map.putString("duration", String.valueOf(duration));
    try {
      reactContext
        .getJSModule(RCTDeviceEventEmitter.class)
        .emit("onPlay", map);

    } catch (Exception e) {
      Log.e("ReactNative", "Caught Exception: " + e.getMessage());
    }
  }

  private void onTimeChanged(PlayerEvent.TimeChanged event) {
    WritableMap map = Arguments.createMap();
    stoppedTime = Double.valueOf(player.getCurrentTime());
    map.putString("message", "timeChanged");
    map.putString("time", String.valueOf(stoppedTime));
    map.putString("duration", String.valueOf(duration));
    stoppedTime = Double.valueOf(player.getCurrentTime());
    try {
      reactContext
        .getJSModule(RCTDeviceEventEmitter.class)
        .emit("onTimeChanged", map);

    } catch (Exception e) {
      Log.e("ReactNative", "Caught Exception: " + e.getMessage());
    }
  }

  private void onPause(PlayerEvent.Paused event) {
    WritableMap map = Arguments.createMap();
    stoppedTime = Double.valueOf(player.getCurrentTime());
    map.putString("message", "pause");
    map.putString("time", String.valueOf(stoppedTime));
    map.putString("duration", String.valueOf(duration));
    try {
      reactContext
        .getJSModule(RCTDeviceEventEmitter.class)
        .emit("onPause", map);

    } catch (Exception e) {
      Log.e("ReactNative", "Caught Exception: " + e.getMessage());
    }
  }

  private void onLoad(SourceEvent.Loaded event) {
    WritableMap map = Arguments.createMap();
    duration = Double.valueOf(player.getDuration());
    map.putString("message", "load");
    map.putString("duration", String.valueOf(duration));
    try {
      reactContext
        .getJSModule(RCTDeviceEventEmitter.class)
        .emit("onLoad", map);

    } catch (Exception e) {
      Log.e("ReactNative", "Caught Exception: " + e.getMessage());
    }
  }

  private void onSeek(PlayerEvent.Seek event) {
    WritableMap map = Arguments.createMap();
    map.putString("message", "seek");
    map.putString("time", Double.valueOf(player.getCurrentTime()).toString());
    map.putString("duration", Double.valueOf(player.getDuration()).toString());
    try {
      reactContext
        .getJSModule(RCTDeviceEventEmitter.class)
        .emit("onSeek", map);

    } catch (Exception e) {
      Log.e("ReactNative", "Caught Exception: " + e.getMessage());
    }
  }

  private void onSeeked(PlayerEvent.Seeked event) {
    WritableMap map = Arguments.createMap();
    stoppedTime = Double.valueOf(player.getCurrentTime());
    map.putString("message", "seeked");
    map.putString("time", String.valueOf(stoppedTime));
    map.putString("duration", String.valueOf(duration));
    try {
      reactContext
        .getJSModule(RCTDeviceEventEmitter.class)
        .emit("onSeeked", map);
    } catch (Exception e) {
      Log.e("ReactNative", "Caught Exception: " + e.getMessage());
    }
  }

  private void onDestroy(PlayerEvent.Destroy event) {
    WritableMap map = Arguments.createMap();
    map.putString("message", "destroy");
    map.putString("time", String.valueOf(stoppedTime));
    map.putString("duration", String.valueOf(duration));
    try {
      reactContext
        .getJSModule(RCTDeviceEventEmitter.class)
        .emit("onDestroy", map);

    } catch (Exception e) {
      Log.e("ReactNative", "Caught Exception: " + e.getMessage());
    }
  }

  private void onPlaybackFinished(PlayerEvent.PlaybackFinished event) {
    WritableMap map = Arguments.createMap();
    map.putString("message", "onPlaybackFinished");
    map.putString("time", Double.valueOf(player.getCurrentTime()).toString());
    map.putString("duration", Double.valueOf(player.getDuration()).toString());
    try {
      reactContext
        .getJSModule(RCTDeviceEventEmitter.class)
        .emit("onPlaybackFinished", map);

    } catch (Exception e) {
      Log.e("ReactNative", "Caught Exception: " + e.getMessage());
    }
  }

  private void onReady(PlayerEvent.Ready event) {
    WritableMap map = Arguments.createMap();
    List<SubtitleTrack> subtitles = player.getAvailableSubtitles();
      WritableArray app_list = new WritableNativeArray();
      for (SubtitleTrack subtitleTrack : subtitles) {
        try {
          WritableMap track = new WritableNativeMap();
          track.putString("id", subtitleTrack.getId());
          track.putString("label", subtitleTrack.getLabel());
          track.putString("url", subtitleTrack.getUrl());
          app_list.pushMap(track);
        } catch (Exception ex) {
          System.err.println("Exception: " + ex.getMessage());
        }
      }
    duration = Double.valueOf(player.getDuration());
    map.putString("message", "ready");
    map.putString("duration", String.valueOf(duration));
    map.putArray("subtitles", app_list);
    if (mustAutoPlay == true) {
      player.play();
    }
    try {
      reactContext
        .getJSModule(RCTDeviceEventEmitter.class)
        .emit("onReady", map);
    } catch (Exception e) {
      Log.e("ReactNative", "Caught Exception: " + e.getMessage());
    }
  }

  private void onError(SourceEvent.Error event) {
    WritableMap map = Arguments.createMap();
    map.putString("message", "error");
    map.putString("errMessage", event.getMessage());
    map.putString("errCode", String.valueOf(event.getCode().getValue()));
    try {
      reactContext
        .getJSModule(RCTDeviceEventEmitter.class)
        .emit("onError", map);

    } catch (Exception e) {
      Log.e("ReactNative", "Caught Exception: " + e.getMessage());
    }
  }

  private void onSubtitleChanged(SourceEvent.SubtitleChanged event) {
    WritableMap map = Arguments.createMap();
    SubtitleTrack newSubtitleTrack = event.getNewSubtitleTrack();
    SubtitleTrack oldSubtitleTrack = event.getOldSubtitleTrack();
    map.putString("message", "subtitleChanged");
    if (newSubtitleTrack != null) {
      map.putString("newSubtitleId", newSubtitleTrack.getId());
    }
    if (oldSubtitleTrack != null) {
      map.putString("oldSubtitleId", oldSubtitleTrack.getId());
    }
    try {
      reactContext
        .getJSModule(RCTDeviceEventEmitter.class)
        .emit("onSubtitleChanged", map);

    } catch (Exception e) {
      Log.e("ReactNative", "Caught Exception: " + e.getMessage());
    }
  }
}
