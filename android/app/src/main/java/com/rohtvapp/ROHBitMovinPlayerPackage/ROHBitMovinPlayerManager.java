package com.rohtvapp.ROHBitMovinPlayerPackage;

import android.util.Log;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;

// import com.bitmovin.analytics.BitmovinAnalyticsConfig;
// import com.bitmovin.analytics.bitmovin.player.BitmovinPlayerCollector;
import com.bitmovin.player.PlayerView;
import com.bitmovin.player.SubtitleView;
import com.bitmovin.player.api.PlaybackConfig;
import com.bitmovin.player.api.Player;
import com.bitmovin.player.api.PlayerConfig;
import com.bitmovin.player.api.event.PlayerEvent;
import com.bitmovin.player.api.event.SourceEvent;
// import com.bitmovin.player.api.event;
import com.bitmovin.player.api.media.subtitle.SubtitleTrack;
// import com.bitmovin.player.api.media.thumbnail.ThumbnailTrack;
import com.bitmovin.player.api.source.Source;
import com.bitmovin.player.api.source.SourceConfig;
import com.bitmovin.player.api.source.SourceOptions;
import com.bitmovin.player.api.source.SourceType;
import com.bitmovin.player.api.ui.StyleConfig;
import com.bitmovin.player.ui.CustomMessageHandler;

import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReadableMap;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.modules.core.DeviceEventManagerModule.RCTDeviceEventEmitter;
import com.facebook.react.uimanager.SimpleViewManager;
import com.facebook.react.uimanager.ThemedReactContext;
import com.facebook.react.uimanager.annotations.ReactProp;

import org.json.JSONObject;
import java.util.Map;
import java.util.Arrays;
import java.util.List;

public class ROHBitMovinPlayerManager extends SimpleViewManager<PlayerView> {

  public static final String REACT_CLASS = "ROHBitMovinPlayer";

  private PlayerView playerView;
  private Player player;
  private SubtitleView  subtitleView;
  private ThemedReactContext reactContext;

  private ReadableMap configuration;
  private ReadableMap analyticsConfig;
  // private BitmovinPlayerCollector analyticsCollector;
  private PlayerConfig playerConfig = new PlayerConfig();
  // private PlaybackConfig playbackConfig = PlaybackConfig();
  private SubtitleTrack subtitleTrack;
  // private ThumbnailTrack thumbnailTrack;
  private int heartbeat = 10;
  private double offset = 0.0;
  private boolean nextCallback = false;
  private boolean customSeek = false;

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @Override
  public PlayerView createViewInstance(ThemedReactContext context) {
    reactContext = context;

    // playerConfig.playbackConfig = playbackConfig;

    StyleConfig styleConfig = new StyleConfig();
    styleConfig.setUiEnabled(false);

    playerConfig.setStyleConfig(styleConfig);

    player = Player.create(reactContext, playerConfig);

    playerView = new PlayerView(reactContext, player);

    // playerView.layoutParams = ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);

    player.on(SourceEvent.Loaded.class, this::onLoad);
    player.on(PlayerEvent.Playing.class, this::onPlay);
    player.on(PlayerEvent.Paused.class, this::onPause);
    player.on(PlayerEvent.Seek.class, this::onSeek);
    player.on(PlayerEvent.TimeChanged.class, this::onTimeChanged);

    return playerView;
  }

  @ReactProp(name = "autoPlay")
  public void setAutoPlay(PlayerView view, Boolean autoPlay) {
    if (autoPlay != null && autoPlay == true) {
      // playbackConfig.isAutoplayEnabled = true;
    }
  }

  @ReactProp(name = "configuration")
  public void setConfiguration(PlayerView view, ReadableMap config) {
    ReadableMap configuration = config;

    String url = "";
    String poster = "";
    SourceType type;

    if (configuration != null && configuration.getString("url") != null) {
      url = configuration.getString("url");

      if (configuration.getString("subtitles") != null) {
        subtitleTrack = new SubtitleTrack(configuration.getString("subtitles"), null, "en", "en", false, "en");
      }

      // if (configuration.getString("thumbnails") != null) {
      //   thumbnailTrack = ThumbnailTrack(configuration.getString("thumbnails"));
      // }

      if (configuration.getString("poster") != null) {
        poster = configuration.getString("poster");
      }

      List subtitleTracks = Arrays.<SubtitleTrack>asList(subtitleTrack);
      // SourceOptions options = new SourceOptions();

      // options.startOffset = configuration.getDouble("startOffset");

      Source source = Source.create(
        new SourceConfig(
          url,
          SourceType.Hls
        )
      );

      player.load(source);

      player.setVolume(100);

      // subtitleView = SubtitleView(reactContext);
      // subtitleView.setPlayer(player);
    }

    if (configuration != null && configuration.getString("heartbeat") != null) {
      heartbeat = Integer.parseInt(configuration.getString("hearbeat"));
    }
  }

  private void onPlay(PlayerEvent.Playing event) {
    WritableMap map = Arguments.createMap();
    map.putString("message", "play");
    map.putString("time", Double.valueOf(player.getCurrentTime()).toString());
    map.putString("duration", Double.valueOf(player.getDuration()).toString());

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
    map.putString("message", "timeChanged");
    map.putString("time", Double.valueOf(player.getCurrentTime()).toString());
    map.putString("duration", Double.valueOf(player.getDuration()).toString());

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
    map.putString("message", "pause");
    map.putString("time", Double.valueOf(player.getCurrentTime()).toString());
    map.putString("duration", Double.valueOf(player.getDuration()).toString());

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
    map.putString("message", "load");
    map.putString("duration", Double.valueOf(player.getDuration()).toString());

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


}