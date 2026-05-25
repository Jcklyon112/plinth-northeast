export interface MapboxSuggestion {
  id: string;
  placeName: string;
  addressLine: string;
  lon: number;
  lat: number;
  stateCode?: string;
  countyName?: string;
  /** Municipality / city from Mapbox context (e.g. Acton). */
  city?: string;
}

interface MapboxContextItem {
  id: string;
  short_code?: string;
  text?: string;
  text_en?: string;
}

interface MapboxFeature {
  id: string;
  place_name: string;
  center: [number, number];
  text?: string;
  context?: MapboxContextItem[];
}

interface MapboxGeocodeResponse {
  features?: MapboxFeature[];
}

const MAPBOX_BASE = 'https://api.mapbox.com/geocoding/v5/mapbox.places';

function contextItem(context: MapboxContextItem[] | undefined, prefix: string) {
  return (context ?? []).find((c) => c.id?.startsWith(prefix));
}

function parseStateCode(shortCode: string | undefined): string | undefined {
  if (!shortCode) return undefined;
  const m = /^US-([A-Za-z]{2})$/i.exec(shortCode.trim());
  if (m) return m[1].toUpperCase();
  if (/^[A-Za-z]{2}$/.test(shortCode.trim())) return shortCode.trim().toUpperCase();
  return undefined;
}

function buildGeocodeUrl(keyword: string): string | null {
  const token = import.meta.env.VITE_MAPBOX_ACCESS_TOKEN;
  if (!token) return null;

  const params = new URLSearchParams({
    access_token: token,
    country: 'US',
    types: 'address',
    limit: '6',
    language: 'en',
    autocomplete: 'true',
  });

  const bbox = import.meta.env.VITE_MAPBOX_BBOX;
  if (bbox) params.set('bbox', bbox);

  const proximity = import.meta.env.VITE_MAPBOX_PROXIMITY;
  if (proximity) params.set('proximity', proximity);

  return `${MAPBOX_BASE}/${encodeURIComponent(keyword)}.json?${params.toString()}`;
}

export async function fetchAddressSuggestions(keyword: string): Promise<MapboxSuggestion[]> {
  const q = keyword.trim();
  if (q.length < 3) return [];

  const url = buildGeocodeUrl(q);
  if (!url) return [];

  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Mapbox geocoding failed (${res.status})`);
  }

  const data = (await res.json()) as MapboxGeocodeResponse;
  return (data.features ?? []).map((f) => {
    const region = contextItem(f.context, 'region.');
    const district = contextItem(f.context, 'district.');
    const place = contextItem(f.context, 'place.');
    return {
      id: f.id,
      placeName: f.place_name,
      addressLine: f.text ? `${f.text}, ${f.place_name}` : f.place_name,
      lon: f.center[0],
      lat: f.center[1],
      stateCode: parseStateCode(region?.short_code),
      countyName: district?.text_en || district?.text,
      city: place?.text_en || place?.text,
    };
  });
}

export function hasMapboxToken(): boolean {
  return Boolean(import.meta.env.VITE_MAPBOX_ACCESS_TOKEN);
}
