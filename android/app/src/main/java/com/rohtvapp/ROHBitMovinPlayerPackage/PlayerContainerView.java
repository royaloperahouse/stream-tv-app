package com.rohtvapp.ROHBitMovinPlayerPackage;

import android.content.Context;
import android.widget.RelativeLayout;

import com.bitmovin.player.PlayerView;
import com.bitmovin.player.SubtitleView;
import com.bitmovin.player.api.Player;
import com.bitmovin.player.api.event.SourceEvent;
import com.bitmovin.player.api.event.PlayerEvent;
import com.bitmovin.player.api.ui.StyleConfig;
import com.bitmovin.player.api.PlayerConfig;
import com.rohtvapp.R;

public class PlayerContainerView extends RelativeLayout {
    private Context context;
    private Player player;
    private PlayerView playerView;
    private SubtitleView subtitleView;

    public PlayerContainerView(Context context) {
        super(context);
        this.context = context;
    }

    public void init() {
        inflate(context, R.layout.player_container, this);

        StyleConfig styleConfig = new StyleConfig();
        styleConfig.setUiEnabled(false);

        PlayerConfig playerConfig = new PlayerConfig();
        playerConfig.setStyleConfig(styleConfig);

        RelativeLayout playerContainer = findViewById(R.id.player_container);

        player = Player.create(context, playerConfig);

        playerView = new PlayerView(context, player);

//        player.on(SourceEvent.Loaded.class, this::onLoad);
//        player.on(PlayerEvent.Playing.class, this::onPlay);
//        player.on(PlayerEvent.Paused.class, this::onPause);
//        player.on(PlayerEvent.Seek.class, this::onSeek);
//        player.on(PlayerEvent.TimeChanged.class, this::onTimeChanged);
//        player.on(PlayerEvent.Destroy.class, this::onDestroy);
//        player.on(PlayerEvent.Seeked.class, this::onSeeked);
//        player.on(PlayerEvent.PlaybackFinished.class, this::onPlaybackFinished);
//        player.on(PlayerEvent.Ready.class, this::onReady);
//        player.on(SourceEvent.Error.class, this::onError);
//        player.on(SourceEvent.SubtitleChanged.class, this::onSubtitleChanged);

        subtitleView = new SubtitleView(context, null);
        subtitleView.setPlayer(player);
        subtitleView.setUserDefaultStyle();
        subtitleView.setUserDefaultTextSize();

        // Add the SubtitleView to the layout
        playerContainer.addView(subtitleView);

        // Add the PlayerView to the layout as first position (so it is the behind the SubtitleView)
        playerContainer.addView(playerView, 0);
    }
}
