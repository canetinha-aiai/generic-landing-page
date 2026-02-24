export interface BusinessInfo {
  name: string;
  tagline?: string;
  description?: string;
  phone: string;
  instagram?: string;
  ifood?: string;
  food99?: string;
  googlePlaceId?: string;
  primaryColor?: string;
  secondaryColor?: string;
  logo?: string;
  favicon?: string;
  keywords?: string;
  ogTitle?: string;
  ogDescription?: string;
  deliveryLogos?: {
    ifood: string;
    food99: string;
  };
}

export interface MenuItem {
  id: string | number;
  name: string;
  description?: string;
  price: number;
  category: string;
  image?: string;
  isHighlight: boolean;
  options?: any;
}

export interface TimeRange {
  open: string;
  close: string;
}

export interface OpeningHours {
  day: number;
  ranges: TimeRange[];
}

export interface StoreData {
  business: BusinessInfo;
  menu: MenuItem[];
  openingHours: OpeningHours[];
}
