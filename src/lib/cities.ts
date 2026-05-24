// Approximate coordinates for Montenegrin cities so in-person calls can be
// placed on the map without a geocoding service.
export const CITY_COORDS: Record<string, [number, number]> = {
  podgorica: [42.441, 19.262],
  niksic: [42.773, 18.944],
  "herceg novi": [42.453, 18.532],
  herceg: [42.453, 18.532],
  kotor: [42.424, 18.771],
  budva: [42.287, 18.84],
  bar: [42.094, 19.099],
  ulcinj: [41.929, 19.224],
  tivat: [42.436, 18.696],
  cetinje: [42.39, 18.916],
  "bijelo polje": [43.038, 19.748],
  berane: [42.843, 19.871],
  pljevlja: [43.357, 19.358],
  danilovgrad: [42.554, 19.108],
  rozaje: [42.84, 20.167],
  kolasin: [42.823, 19.519],
  zabljak: [43.155, 19.122],
};

/**
 * Best-effort match of a free-text location to known city coordinates.
 */
export function locationToCoords(location: string | null): [number, number] | null {
  if (!location) return null;
  const norm = location
    .toLowerCase()
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, ""); // strip diacritics
  for (const [key, coords] of Object.entries(CITY_COORDS)) {
    if (norm.includes(key)) return coords;
  }
  return null;
}
