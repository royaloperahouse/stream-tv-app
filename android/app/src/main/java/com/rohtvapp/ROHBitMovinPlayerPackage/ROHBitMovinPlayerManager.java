package com.rohtvapp.ROHBitMovinPlayerPackage;

import android.util.Log;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;

import com.bitmovin.analytics.BitmovinAnalyticsConfig;
import com.bitmovin.analytics.bitmovin.player.BitmovinPlayerCollector;
import com.bitmovin.player.PlayerView;
import com.bitmovin.player.SubtitleView;
import com.bitmovin.player.api.PlaybackConfig;
import com.bitmovin.player.api.Player;
import com.bitmovin.player.api.PlayerConfig;
import com.bitmovin.player.api.event.PlayerEvent;
import com.bitmovin.player.api.event.SourceEvent;
import com.bitmovin.player.api.event.on;
import com.bitmovin.player.api.media.subtitle.SubtitleTrack;
import com.bitmovin.player.api.media.thumbnail.ThumbnailTrack;
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

public class ROHBitMovinPlayerManager extends SimpleViewManager<PlayerView> {

  public static final String REACT_CLASS = "ROHBitMovinPlayer";

  private PlayerView playerView;
  private Player player;
  private SubtitleView  subtitleView;
  private ThemedReactContext reactContext;

  private ReadableMap configuration;
  private ReadableMap analyticsConfig;
  private BitmovinPlayerCollector analyticsCollector;
  private PlayerConfig playerConfig = PlayerConfig();
  private PlaybackConfig playBackConfig = PlayBackConfig();
  private SubtitleTrack subtitleTrack;
  private ThumbnailTrack thumbnailTrack;
  private heartbeat = 10;
  private offset = 0.0;
  private nextCallback = false;
  private customSeek = false;

  @Override
  public String getName() {
    return REACT_CLASS;
  }

  @ReactProp(name = "autoPlay")
  public void setAutoPlay(PlayerView view, Boolean autoPlay) {
    if (autoPlay != null && autoPlay == true) {
      playBackConfig.isAutoplayEnabled = true;
    }
  }

  @ReactProp(name = "configuration")
  public void setConfiguration(PlayerView view, ReadableMap config) {
    configuration = config;

    title = "";
    subtitle = "";
    url = "";
    poster = "";

    if (configuration != null && configuration.getString("url") != null) {
      url = configuration.getString("url");

      if (configuration.getString("subtitles") != null) {
        subtitleTrack = SubtitleTrack(configuration.getString("subtitles"), null, "en", "en", false, "en");
      }

      if (configuration.getString("thumbnails") != null) {
        thumbnailTrack = ThumbnailTrack(configuration.getString("thumbnails"));
      }

      if (configuration.getString("title") != null) {
        title = configuration.getString("title");
      }

      if (configuration.getString("subtitle") != null) {
        subtitle = configuration.getString("subtitle");
      }

      if (configuration.getString("poster") != null) {
        poster = configuration.getString("poster");
      }

      subtitleTracks = listOf(subtitleTrack);
      options = SourceOptions();

      options.startOffset = configuration.getDouble("startOffset");

      source = Source.create(
        SourceConfig(
          url = url,
          type = SourceType.Dash,
          title = title,
          thumbnailTrack = thumbnailTrack,
          subtitleTracks = subtitleTracks as List<SubtitleTrack>,
          options = options
        )
      );

      player.load(source);

      subtitleView = SubtitleView(reactContextGlobal);
      subtitleView.setPlayer(player);
    }

    if (configuration != null && configuration.getString("heartbeat") != null) {
      heartbeat = configuration.getString("hearbeat")?.toInt() ?: 30;
    }
  }

  private void onPlay(PlayerEvent.TimeChanged event) {
    WritableMap map = Arguments.createMap();
    map.putString("message", "play");
    map.putString("time", player.currentTime.toString());
    map.putString("duration", player.duration.toString());

    try {
      reactContextGlobal
        .getJSModule(RCTDeviceEventEmitter::class.java)
        .emit("onPlay", map);

    } catch (e: Exception) {
      Log.e("ReactNative", "Caught Exception: " + e.message);
    }
  }

  private void onTimeChanged(PlayerEvent.TimeChanged event) {
    WritableMap map = Arguments.createMap();
    map.putString("message", "timeChanged");
    map.putString("time", player.currentTime.toString());
    map.putString("duration", player.duration.toString());

    try {
      reactContextGlobal
        .getJSModule(RCTDeviceEventEmitter::class.java)
        .emit("onTimeChanged", map);

    } catch (e: Exception) {
      Log.e("ReactNative", "Caught Exception: " + e.message);
    }
  }

  private void onPause(PlayerEvent.Paused event) {
    WritableMap map = Arguments.createMap();
    map.putString("message", "pause");
    map.putString("time", player.currentTime.toString());
    map.putString("duration", player.duration.toString());

    try {
      reactContextGlobal
        .getJSModule(RCTDeviceEventEmitter::class.java)
        .emit("onPause", map);

    } catch (e: Exception) {
      Log.e("ReactNative", "Caught Exception: " + e.message);
    }
  }

  private void onLoad(SourceEvent.Loaded event) {
    WritableMap map = Arguments.createMap();
    map.putString("message", "load");
    map.putString("duration", player.duration.toString());

    try {
      reactContextGlobal
        .getJSModule(RCTDeviceEventEmitter::class.java)
        .emit("onLoad", map);

    } catch (e: Exception) {
      Log.e("ReactNative", "Caught Exception: " + e.message);
    }
  }

  private void onSeek(PlayerEvent.Seek event) {
    WritableMap map = Arguments.createMap();
    map.putString("message", "seek");
    map.putString("time", player.currentTime.toString());
    map.putString("duration", player.duration.toString());

    try {
      reactContextGlobal
        .getJSModule(RCTDeviceEventEmitter::class.java)
        .emit("onSeek", map);

    } catch (e: Exception) {
      Log.e("ReactNative", "Caught Exception: " + e.message);
    }
  }

  @Override
  public PlayerView createViewInstance(ThemedReactContext context) {
    reactContext = context;

    playerConfig.playbackConfig = playBackConfig;

    player = Player.create(reactContext, playerConfig);

    playerView = PlayerView(reactContext, player);

    playerView.layoutParams = ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT);
  }


}