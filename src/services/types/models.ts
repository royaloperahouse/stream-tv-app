interface Cast {
  role: string;
  name: string;
}

export interface EventModel {
  id: number;
  title: string;
  type: string;
  captionText: string;
  shortDescription: string;
  description: string;
  thumbnailImage: string;
  previewImage: string;
  info: string;
  cast: Array<Cast>;
  creatives: Array<Cast>;
}

export type TRoutes = Array<TRoute>;

export type TRoute = {
  navMenuScreenName: string;
  SvgIconActiveComponent: any;
  SvgIconInActiveComponent: any;
  navMenuTitle: string;
  position: number;
  isDefault: boolean;
  ScreenComponent: React.FC<any>;
};
