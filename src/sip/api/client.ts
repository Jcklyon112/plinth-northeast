import axios from 'axios';
import type { ParcelCollection, ParcelDetail, ParcelProperties, FilterState } from '../types/parcel';

const BASE = import.meta.env.VITE_API_URL || 'http://localhost:8000';

const api = axios.create({ baseURL: BASE });

export async function fetchParcels(
  municipalityId: string,
  filters: FilterState,
  limit = 3000
): Promise<ParcelCollection> {
  const params: Record<string, string | number> = { limit };
  if (filters.tier !== null) params.tier = filters.tier;
  if (filters.minScore !== null) params.min_score = filters.minScore;
  if (filters.zoningCode) params.zoning_code = filters.zoningCode;

  const res = await api.get(`/parcels/${municipalityId}`, { params });
  return res.data;
}

export async function fetchParcelDetail(
  municipalityId: string,
  parcelId: string
): Promise<ParcelDetail> {
  const res = await api.get(`/parcels/detail/${municipalityId}/${parcelId}`);
  return res.data;
}

export async function fetchMunicipalities() {
  const res = await api.get('/municipalities/');
  return res.data;
}

export async function updateAnalystRecord(
  municipalityId: string,
  parcelId: string,
  data: Record<string, unknown>
) {
  const res = await api.put(`/parcels/analyst/${municipalityId}/${parcelId}`, data);
  return res.data;
}

export function exportCsvUrl(municipalityId: string, filters: FilterState): string {
  const params = new URLSearchParams();
  if (filters.tier !== null) params.set('tier', String(filters.tier));
  if (filters.minScore !== null) params.set('min_score', String(filters.minScore));
  return `${BASE}/parcels/export/${municipalityId}/csv?${params.toString()}`;
}

export interface AutoScanResult {
  scan_run_id: string;
  municipality_id: string;
  municipality_name: string;
  state: string;
  county: string;
  status: string;
  message: string;
}

export interface ScanRunStatus {
  id: string;
  municipality_id: string;
  status: string;
  run_type: string;
  parcels_ingested: number | null;
  parcels_scored: number | null;
  started_at: string | null;
  completed_at: string | null;
  error_log?: string | null;
}

export async function startAutoScan(query: string): Promise<AutoScanResult> {
  const res = await api.post('/scans/auto-scan', { query });
  return res.data;
}

export async function getScanStatus(scanRunId: string): Promise<ScanRunStatus> {
  const res = await api.get(`/scans/detail/${scanRunId}`);
  return res.data;
}

export interface ParcelSearchResult {
  status: 'found' | 'no_match';
  message?: string;
  source?: 'regrid' | 'arcgis';
  parcel?: ParcelProperties;
  geometry?: GeoJSON.Geometry | null;
  rule_results?: Array<{
    rule_id: string;
    rule_category: string;
    result: string;
    explanation: string;
    confidence: number | null;
  }>;
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
