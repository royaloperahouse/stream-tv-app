
package com.rohtvapp.ROHBitMovinPlayerPackage;

import android.view.View;

import com.bitmovin.player.PlayerView;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Callback;

public class ROHBitMovinPlayerModule extends ReactContextBaseJavaModule {

  private final ReactApplicationContext _reactContext;

  public ROHBitMovinPlayerModule(ReactApplicationContext reactContext) {
    super(reactContext);

    _reactContext = reactContext;
  }

  @Override
  public String getName() {
    return "ROHBitMovinPlayerControl";
  }

  @ReactMethod
  public void play(int tag) {
    View playerView = getCurrentActivity().findViewById(tag);

    if (playerView instanceof PlayerView) {
      ((PlayerView) playerView).getPlayer().play();
    } else {
      throw new ClassCastException(String.format("Cannot play: view with tag #%d is not a ROHBitMovinPlayer", tag));
    }
  }

  @ReactMethod
  public void pause(int tag) {
    View playerView = getCurrentActivity().findViewById(tag);

    if (playerView instanceof PlayerView) {
      ((PlayerView) playerView).getPlayer().pause();
    } else {
      throw new ClassCastException(String.format("Cannot pause: view with tag #%d is not a ROHBitMovinPlayer", tag));
    }
  }

  @ReactMethod
  public void seek(int tag, double time) {
    View playerView = getCurrentActivity().findViewById(tag);

    if (playerView instanceof PlayerView) {
      ((PlayerView) playerView).getPlayer().seek(time);
    } else {
      throw new ClassCastException(String.format("Cannot seek: view with tag #%d is not a ROHBitMovinPlayer", tag));
    }
  }

  @ReactMethod
  public void getCurrentTime(int tag, Promise promise) {
    View playerView = getCurrentActivity().findViewById(tag);

    if (playerView instanceof PlayerView) {
      double currentTime = ((PlayerView) playerView).getPlayer().getCurrentTime();

      promise.resolve(currentTime);
    } else {
      throw new ClassCastException(String.format("Cannot getCurrentTime: view with tag #%d is not a ROHBitMovinPlayer", tag));
    }
  }

  @ReactMethod
  public void getDuration(int tag, Promise promise) {
    View playerView = getCurrentActivity().findViewById(tag);

    if (playerView instanceof PlayerView) {
      double duration = ((PlayerView) playerView).getPlayer().getDuration();

      promise.resolve(duration);
    } else {
      throw new ClassCastException(String.format("Cannot getDuration: view with tag #%d is not a ROHBitMovinPlayer", tag));
    }
  }

  @ReactMethod
  public void isMuted(int tag, Promise promise) {
    View playerView = getCurrentActivity().findViewById(tag);

    if (playerView instanceof PlayerView) {
      boolean isMuted = ((PlayerView) playerView).getPlayer().isMuted();

      promise.resolve(isMuted);
    } else {
      throw new ClassCastException(String.format("Cannot isMuted: view with tag #%d is not a ROHBitMovinPlayer", tag));
    }
  }

  @ReactMethod
  public void isPaused(int tag, Promise promise) {
    View playerView = getCurrentActivity().findViewById(tag);

    if (playerView instanceof PlayerView) {
      boolean isPaused = ((PlayerView) playerView).getPlayer().isPaused();

      promise.resolve(isPaused);
    } else {
      throw new ClassCastException(String.format("Cannot isPaused: view with tag #%d is not a ROHBitMovinPlayer", tag));
    }
  }

  @ReactMethod
  public void isStalled(int tag, Promise promise) {
    View playerView = getCurrentActivity().findViewById(tag);

    if (playerView instanceof PlayerView) {
      boolean isStalled = ((PlayerView) playerView).getPlayer().isStalled();

      promise.resolve(isStalled);
    } else {
      throw new ClassCastException(String.format("Cannot isStalled: view with tag #%d is not a ROHBitMovinPlayer", tag));
    }
  }

  @ReactMethod
  public void isPlaying(int tag, Promise promise) {
    View playerView = getCurrentActivity().findViewById(tag);

    if (playerView instanceof PlayerView) {
      boolean isPlaying = ((PlayerView) playerView).getPlayer().isPlaying();

      promise.resolve(isPlaying);
    } else {
      throw new ClassCastException(String.format("Cannot isPlaying: view with tag #%d is not a ROHBitMovinPlayer", tag));
    }
  }

  @ReactMethod
  public void destroy(int tag) {
    View playerView = getCurrentActivity().findViewById(tag);

    if (playerView instanceof PlayerView) {
      ((PlayerView) playerView).getPlayer().destroy();
    } else {
      throw new ClassCastException(String.format("Cannot destroy: view with tag #%d is not a ROHBitMovinPlayer", tag));
    }
  }
  @ReactMethod
  public void restart(int tag) {
    View playerView = getCurrentActivity().findViewById(tag);

    if (playerView instanceof PlayerView) {
      ((PlayerView) playerView).getPlayer().seek(0.0);
      ((PlayerView) playerView).getPlayer().play();
    } else {
      throw new ClassCastException(String.format("Cannot seek: view with tag #%d is not a ROHBitMovinPlayer", tag));
    }
  }
}