export const Colors = Object.freeze({
  backgroundColor: '#0E1B31',
  backgroundColorTransparent: '#0E1B31CC',
  defaultBlue: '#6990CE',
  navIconDefault: '#F1F1F1',
  navIconActive: '#FFFFFF',
  defaultTextColor: '#F1F1F1',
  searchDisplayBackgroundColor: '#4B5B7A',
  midGrey: '#7E91B4',
  title: '#FFFFFF'
});

export const Images = Object.freeze({
  introBackground: require('@assets/intro_background.png'),
  defaultBackground: require('@assets/default_background.png'),
  ROHLogo: require('@assets/ROH_Logo.png'),
  streamLogo: require('@assets/Stream_Logo.png'),
  loadingScreen: require('@assets/TV_01_loading.jpg'),
});

export const Fonts = Object.freeze({
  default: 'GothamSSm-Medium',
  bold: 'GothamSSm-Bold',
  italic: 'GothamSSm-MediumItalic',
  boldItalic: 'GothamSSm-BoldItalic',
});

export const Icons = Object.freeze({
  addToList: require('@assets/icons/add_to_list.png'),
  back: require('@assets/icons/back.png'),
  bell: require('@assets/icons/bell.png'),
  down: require('@assets/icons/down.png'),
  trailer: require('@assets/icons/trailer.png'),
  watch: require('@assets/icons/watch.png'),
});

export const PlayerIcons = Object.freeze({
  play: require('@assets/icons/player_play.png'),
  pause: require('@assets/icons/player_pause.png'),
  seekForward: require('@assets/icons/player_seek_forward.png'),
  seekBackward: require('@assets/icons/player_seek_backward.png'),
  subtitles: require('@assets/icons/player_subtitles.png'),
  description: require('@assets/icons/player_description.png'),
  close: require('@assets/icons/player_close.png'),
  restart: require('@assets/icons/player_restart.png'),
});

export default Object.freeze({
  colors: Colors,
  images: Images,
  icons: Icons,
  fonts: Fonts,
  playerIcons: PlayerIcons,
});
