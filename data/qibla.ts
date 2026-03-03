/** Kaaba coordinates (Masjid al-Haram, Makkah) */
export const KAABA_LAT = 21.4225
export const KAABA_LNG = 39.8262

/** Convert degrees to radians */
function toRad(deg: number): number {
  return (deg * Math.PI) / 180
}

/** Convert radians to degrees */
function toDeg(rad: number): number {
  return (rad * 180) / Math.PI
}

/**
 * Calculate the Qibla bearing from a given location using the great circle formula.
 *
 * Formula: atan2(sin(DeltaLambda) * cos(phi2), cos(phi1) * sin(phi2) - sin(phi1) * cos(phi2) * cos(DeltaLambda))
 *
 * Returns bearing in degrees normalized to 0-360.
 */
export function calculateQiblaBearing(lat: number, lng: number): number {
  const phi1 = toRad(lat)
  const phi2 = toRad(KAABA_LAT)
  const deltaLambda = toRad(KAABA_LNG - lng)

  const y = Math.sin(deltaLambda) * Math.cos(phi2)
  const x =
    Math.cos(phi1) * Math.sin(phi2) - Math.sin(phi1) * Math.cos(phi2) * Math.cos(deltaLambda)

  const bearing = toDeg(Math.atan2(y, x))

  // Normalize to 0-360
  return (bearing + 360) % 360
}

/**
 * Calculate the distance from a given location to the Kaaba using the haversine formula.
 * Returns the distance in kilometers.
 */
export function distanceToKaaba(lat: number, lng: number): number {
  const R = 6371 // Earth's radius in km

  const phi1 = toRad(lat)
  const phi2 = toRad(KAABA_LAT)
  const deltaPhi = toRad(KAABA_LAT - lat)
  const deltaLambda = toRad(KAABA_LNG - lng)

  const a =
    Math.sin(deltaPhi / 2) * Math.sin(deltaPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(deltaLambda / 2) * Math.sin(deltaLambda / 2)

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))

  return R * c
}

/**
 * Convert a bearing in degrees to a compass direction string.
 * Returns one of: N, NE, E, SE, S, SW, W, NW
 */
export function bearingToCompass(bearing: number): string {
  const normalized = ((bearing % 360) + 360) % 360
  const directions = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW']
  const index = Math.round(normalized / 45) % 8
  return directions[index]
}
