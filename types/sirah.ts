export type Ibrah = {
  id: string;
  title: string;
  description: string;
  practicalAction: string;
};

export type Coordinate = [number, number]; // [longitude, latitude]

export type SirahEvent = {
  id: string;
  order: number;
  title: {
    id: string;
    en: string;
    ar?: string;
  };
  description: {
    id: string;
    en: string;
    ar?: string;
  };
  bookReference: {
    page: number;
    chapter: string;
  };
  mapData: {
    center: Coordinate;
    zoom: number;
    pitch: number;
    bearing: number;
  };
  tacticalData?: {
    type: "FeatureCollection";
    features: any[];
  };
  ibrahs: Ibrah[];
};
