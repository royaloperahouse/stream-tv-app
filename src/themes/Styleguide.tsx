export const Colors = Object.freeze({
  backgroundColor: '#0E1B31',
  backgroundColorTransparent: '#0E1B31CC',
  defaultBlue: '#6990CE',
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

export default Object.freeze({
  colors: Colors,
  images: Images,
  icons: Icons,
  fonts: Fonts,
});
