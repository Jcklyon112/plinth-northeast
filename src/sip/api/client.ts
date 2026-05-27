import axios from 'axios';
import type { ModelPlacement, ParcelProperties, ParcelRentEstimate } from '../types/parcel';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: BASE });

export interface ParcelSearchResult {
  status: 'found' | 'no_match';
  message?: string;
  source?: 'rapidapi';
  parcel?: Pick<ParcelProperties, 'address' | 'lot_area_sqft'>;
  geometry?: GeoJSON.Geometry | null;
  placement?: ModelPlacement | null;
  rent?: ParcelRentEstimate | null;
}

export async function searchParcel(
  address: string,
  coords: { lat: number; lon: number },
  hints?: { state_code?: string; county?: string; city?: string },
): Promise<ParcelSearchResult> {
  const res = await api.post('/parcels/search', {
    address,
    lat: coords.lat,
    lon: coords.lon,
    ...(hints?.state_code ? { state_code: hints.state_code } : {}),
    ...(hints?.county ? { county: hints.county } : {}),
    ...(hints?.city ? { city: hints.city } : {}),
  });
  return res.data;
}
