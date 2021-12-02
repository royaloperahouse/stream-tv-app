package com.rohtvapp.ROHBitMovinPlayerPackage;

import android.content.Context;
import android.util.Log;
import android.view.ViewGroup;
import android.widget.RelativeLayout;

import com.bitmovin.analytics.BitmovinAnalyticsConfig;
import com.bitmovin.analytics.bitmovin.player.BitmovinPlayerCollector;
import com.bitmovin.player.PlayerView;
import com.bitmovin.player.SubtitleView;
import com.bitmovin.player.api.Player;
import com.bitmovin.player.api.event.SourceEvent;
import com.bitmovin.player.api.source.Source;
import com.bitmovin.player.api.media.subtitle.SubtitleTrack;
import com.bitmovin.player.api.event.PlayerEvent;
import com.bitmovin.player.api.ui.StyleConfig;
import com.bitmovin.player.api.PlayerConfig;
import com.facebook.react.bridge.Arguments;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.WritableArray;
import com.facebook.react.bridge.WritableMap;
import com.facebook.react.bridge.WritableNativeArray;
import com.facebook.react.bridge.WritableNativeMap;
import com.facebook.react.modules.core.DeviceEventManagerModule;
import com.facebook.react.uimanager.ThemedReactContext;
import com.rohtvapp.R;
import com.bitmovin.player.api.deficiency.ErrorEvent;


import java.util.List;

public class PlayerContainerView extends RelativeLayout {
    private Context context;
    private Player player;
    private PlayerView playerView;
    private SubtitleView subtitleView;
    private SubtitleTrack subtitleTrack;
    private int heartbeat = 10;
    private boolean nextCallback = false;
    private boolean customSeek = false;
    private double stoppedTime = 0.0;
    private double duration = 0.0;
    private boolean mustAutoPlay = false;

    public PlayerContainerView(ThemedReactContext context) {
        super(context);
        this.context = context;
        this.init();
    }

    public void init() {
        inflate(context, R.layout.player_container, this);

        StyleConfig styleConfig = new StyleConfig();
        styleConfig.setUiEnabled(false);

        PlayerConfig playerConfig = new PlayerConfig();
        playerConfig.setStyleConfig(styleConfig);

        playerView = findViewById(R.id.bitmovinPlayerView);
        player = Player.create(context, playerConfig);
        //playerView.setLayoutParams(new ViewGroup.LayoutParams(ViewGroup.LayoutParams.MATCH_PARENT, ViewGroup.LayoutParams.MATCH_PARENT));
        playerView.setPlayer(player);

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
        player.on(PlayerEvent.Error.class, this::onError);


        subtitleView = findViewById(R.id.bitmovinSubtitleView);
        subtitleView.setPlayer(player);

        player.setVolume(100);
    }
//
//    @Override
//    public void requestLayout() {
//        super.requestLayout();
//        post(measureAndLayout);
//    }
//
//    private final Runnable measureAndLayout = new Runnable() {
//        @Override
//        public void run() {
//            measure(MeasureSpec.makeMeasureSpec(getWidth(), MeasureSpec.EXACTLY),
//                    MeasureSpec.makeMeasureSpec(getHeight(), MeasureSpec.EXACTLY));
//            layout(getLeft(), getTop(), getRight(), getBottom());
//        }
//    };

    public void configure(Source source) {
        player.load(source);
    }

    public void setAutoPlay(Boolean autoplay) {
        mustAutoPlay = autoplay;
    }

    public void setAnalytics(BitmovinAnalyticsConfig bitmovinAnalyticsConfig, ThemedReactContext reactContext) {
        BitmovinPlayerCollector analyticsCollector = new BitmovinPlayerCollector(bitmovinAnalyticsConfig, reactContext);
        analyticsCollector.attachPlayer(player);
    }

    public PlayerView getPlayerView() {
        return playerView;
    }

    private void onPlay(PlayerEvent.Playing event) {
        WritableMap map = Arguments.createMap();
        map.putString("message", "play");
        map.putString("time", String.valueOf(stoppedTime));
        map.putString("duration", String.valueOf(duration));
        ReactContext reactContext = (ReactContext)context;
        try {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
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
        ReactContext reactContext = (ReactContext)context;
        try {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
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
        ReactContext reactContext = (ReactContext)context;
        try {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
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
        ReactContext reactContext = (ReactContext)context;
        try {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
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
        ReactContext reactContext = (ReactContext)context;
        try {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
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
        ReactContext reactContext = (ReactContext)context;
        try {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
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
        ReactContext reactContext = (ReactContext)context;
        try {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
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
        ReactContext reactContext = (ReactContext)context;
        try {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
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
        ReactContext reactContext = (ReactContext)context;
        try {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onReady", map);
        } catch (Exception e) {
            Log.e("ReactNative", "Caught Exception: " + e.getMessage());
        }
    }

    private void onError(ErrorEvent event) {
        WritableMap map = Arguments.createMap();
        map.putString("message", "error");
        map.putString("errMessage", event.getMessage());
        map.putString("errCode", String.valueOf(event.getCode().getValue()));
        ReactContext reactContext = (ReactContext)context;
        try {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
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
        ReactContext reactContext = (ReactContext)context;
        try {
            reactContext
                    .getJSModule(DeviceEventManagerModule.RCTDeviceEventEmitter.class)
                    .emit("onSubtitleChanged", map);

        } catch (Exception e) {
            Log.e("ReactNative", "Caught Exception: " + e.getMessage());
        }
    }
}

