export default (center: { lat: number, lng: number }, radius: number) => {
  const w = radius / 111300 * Math.sqrt(Math.random())
  const t = 2 * Math.PI * Math.random()
  return {
    lat: (w * Math.sin(t)) + center.lat,
    lng: (w * Math.cos(t) / Math.cos(center.lat)) + center.lng
  }
}