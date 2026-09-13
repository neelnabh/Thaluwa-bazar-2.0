export interface GeoLocation {
  name: string;
  name_as: string;
  lat: number;
  lng: number;
  district: string;
}

export const ASSAM_LOCATIONS: GeoLocation[] = [
  { name: "Guwahati - Beltola Bazar", name_as: "বেলতলা বজাৰ, গুৱাহাটী", lat: 26.1285, lng: 91.7925, district: "Kamrup Metro" },
  { name: "Guwahati - Panbazar / Fancy Bazar", name_as: "পানবজাৰ / ফাঁচি বজাৰ", lat: 26.1856, lng: 91.7454, district: "Kamrup Metro" },
  { name: "Guwahati - Uzanbazar (Fish Market)", name_as: "উজানবজাৰ মাছ বজাৰ", lat: 26.1912, lng: 91.7618, district: "Kamrup Metro" },
  { name: "Guwahati - Dispur / Super Market", name_as: "দিছপুৰ / ছুপাৰ মাৰ্কেট", lat: 26.1424, lng: 91.7898, district: "Kamrup Metro" },
  { name: "Guwahati - Maligaon / Jalukbari", name_as: "মালিগাঁও / জালুকবাৰী", lat: 26.1558, lng: 91.6895, district: "Kamrup Metro" },
  { name: "Guwahati - Silpukhuri / Chandmari", name_as: "শিলপুখুৰী / চান্দমাৰী", lat: 26.1865, lng: 91.7725, district: "Kamrup Metro" },
  { name: "Jorhat - Gar-Ali / Chowk", name_as: "গড়-আলি, যোৰহাট", lat: 26.7509, lng: 94.2037, district: "Jorhat" },
  { name: "Dibrugarh - New Market", name_as: "নতুন বজাৰ, ডিব্ৰুগড়", lat: 27.4728, lng: 94.9120, district: "Dibrugarh" },
  { name: "Tezpur - Chowk Bazar", name_as: "চক বজাৰ, তেজপুৰ", lat: 26.6338, lng: 92.7926, district: "Sonitpur" },
  { name: "Nagaon - Haiborgaon", name_as: "হয়বৰগাঁও, নগাঁও", lat: 26.3475, lng: 92.6841, district: "Nagaon" },
  { name: "Sivasagar - Central Market", name_as: "শিৱসাগৰ কেন্দ্ৰীয় বজাৰ", lat: 26.9826, lng: 94.6425, district: "Sivasagar" },
  { name: "Silchar - Fatak Bazar", name_as: "ফাটক বজাৰ, শিলচৰ", lat: 24.8333, lng: 92.7789, district: "Cachar" }
];

/**
 * Calculates haversine distance in kilometers between two lat/lng coordinates
 */
export function calculateDistanceKm(
  lat1: number,
  lng1: number,
  lat2: number,
  lng2: number
): number {
  const R = 6371; // Earth's radius in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  const d = R * c;
  return Math.round(d * 10) / 10; // 1 decimal place
}

export function formatDistance(km: number, lang: 'as' | 'en' = 'as'): string {
  if (km < 1) {
    const meters = Math.round(km * 1000);
    return lang === 'as' ? `${meters} মিটাৰ দূৰত` : `${meters} m away`;
  }
  return lang === 'as' ? `${km} কিঃমিঃ দূৰত` : `${km} km away`;
}
