/** Parcel attributes on map features and in the detail panel. */
export interface ParcelProperties {
  address?: string | null;
  lot_area_sqft?: number | null;
  zoning_code?: string | null;
  zoning_district?: string | null;
  zoning_district_label?: string | null;
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
