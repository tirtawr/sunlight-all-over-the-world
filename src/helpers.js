export function getLat(geoJsonPoint) {
  return geoJsonPoint.geometry.coordinates[1]
}

export function getLng(geoJsonPoint) {
  return geoJsonPoint.geometry.coordinates[0]
}
