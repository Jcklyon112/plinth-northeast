/** Plinth ADU placement returned from parcel search. */
export interface ModelPlacement {
  model_id: number;
  model_name: string;
  model_description: string;
  footprint_label: string;
  sqft: number;
  bedrooms: number;
  bathrooms: number;
  kitchen: string;
  width_ft: number;
  length_ft: number;
  geometry: GeoJSON.Polygon;
  available_area_geometry?: GeoJSON.Polygon | GeoJSON.MultiPolygon | null;
  building_geometry?: GeoJSON.Polygon | null;
  setbacks_ft?: { building: number; between_models: number };
}

export interface ParcelRentEstimate {
  status: 'ok' | 'error' | 'unconfigured';
  message?: string;
  monthly_rent_usd?: number;
  rent_range_low_usd?: number | null;
  rent_range_high_usd?: number | null;
  property_type?: string;
  bedrooms?: number;
  bathrooms?: number;
  square_footage?: number;
}

/** Parcel attributes on map features and in the detail panel. */
export interface ParcelProperties {
  address?: string | null;
  lot_area_sqft?: number | null;
  zoning_code?: string | null;
  zoning_district?: string | null;
  zoning_district_label?: string | null;
  placement?: ModelPlacement | null;
  rent?: ParcelRentEstimate | null;
}

export interface ParcelFeature {
  type: 'Feature';
  geometry: GeoJSON.Geometry;
  properties: ParcelProperties;
}

export interface ParcelCollection {
  type: 'FeatureCollection';
  features: ParcelFeature[];
  total: number;
}
