import { geoContains } from 'd3-geo';
const ctx: Worker = self as any;

const getContainedPolygons = (
  marker: [number, number],
  features: any[]
) => {
  const indices: number[] = []
  features.forEach((feature, index) => {
    let paths: [number, number][] = []
    if (feature.geometry.type === "MultiPolygon") {
      feature.geometry.coordinates.forEach((entry: [number, number][][]) => {
        paths = paths.concat(entry[0]);
      })
    } else if (feature.geometry.type === "Polygon") {
      paths = feature.geometry.coordinates[0]
    }
    if (geoContains(feature, marker)) {
      indices.push(index)
    }
  })
  return indices
};

ctx.onmessage = (event: { data: { markers: [number, number][], features: object[] } }) => {
  event.data.markers.forEach((marker, index) => {
    ctx.postMessage({
      index,
      polygonIndices: getContainedPolygons(marker, event.data.features)
    });
  })
};