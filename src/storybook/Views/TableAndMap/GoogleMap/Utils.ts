class OverlayJson {
  public type!: string
  public geometry!: [number, number] | [[number, number], [number, number]] | [number, number][][]
  public radius?: number
}

export default class Utils {

  public static overlayEventsToJson(arr: google.maps.drawing.OverlayCompleteEvent[]) {
    return arr.map(event => {
      switch (event.type) {
        case google.maps.drawing.OverlayType.RECTANGLE:
          return {
            type: this.t_(event.type),
            geometry: this.b_((event.overlay as google.maps.Rectangle).getBounds())
          }
        case google.maps.drawing.OverlayType.POLYGON:
          return {
            type: this.t_(event.type),
            geometry: this.m_((event.overlay as google.maps.Polygon).getPaths())
          }
        case google.maps.drawing.OverlayType.CIRCLE:
          const circle = event.overlay as google.maps.Circle
          return {
            type: this.t_(event.type),
            geometry: this.p_(circle.getCenter()),
            radius: circle.getRadius()
          }
      }
    }) as OverlayJson[]
  }

  public static jsonToOverlayEvents(arr: OverlayJson[]) {
    return arr.map(json => {
      switch (json.type) {
        case 'RECTANGLE':
          return {
            type: google.maps.drawing.OverlayType.RECTANGLE,
            overlay: new google.maps.Rectangle({
              bounds: this.bb_.apply(this, json.geometry as [[number, number], [number, number]])
            })
          }
        case 'POLYGON':
          return {
            type: google.maps.drawing.OverlayType.POLYGON,
            overlay: new google.maps.Polygon({
              paths: this.mm_(json.geometry as [number, number][][])
            })
          }
        case 'CIRCLE':
          return {
            type: google.maps.drawing.OverlayType.CIRCLE,
            overlay: new google.maps.Circle({
              radius: json.radius,
              center: this.pp_.apply(this, json.geometry as [number, number])
            })
          }
      }
    }) as google.maps.drawing.OverlayCompleteEvent[]
  }

  private static t_(s: string): string {
    const t = ['CIRCLE', 'RECTANGLE', 'POLYGON']
    for (let i = 0; i < t.length; ++i) {
      if (s === google.maps.drawing.OverlayType[t[i]]) {
        return t[i]
      }
    }
    return 'UNKNOWN'
  }

  private static b_(bounds: google.maps.LatLngBounds) {
    return [this.p_(bounds.getSouthWest()), this.p_(bounds.getNorthEast())]
  }

  private static p_(latLng: google.maps.LatLng): [number, number] {
    return [latLng.lat(), latLng.lng()]
  }

  private static pp_(lat: number, lng: number): google.maps.LatLng {
    return new google.maps.LatLng(lat, lng)
  }

  private static m_(paths) {
    paths = paths.getArray ? paths.getArray() : paths
    const r: [number, number][][] = []
    for (let i = 0; i < paths.length; ++i) {
      r.push(this.l_(paths[i]))
    }
    return r
  }

  private static l_(path): [number, number][] {
    path = path.getArray ? path.getArray() : path
    const r: [number, number][] = []
    for (let i = 0; i < path.length; ++i) {
      r.push(this.p_(path[i]))
    }
    return r
  }

  private static bb_(sw: [number, number], ne: [number, number]) {
    return new google.maps.LatLngBounds(
      this.pp_.apply(this, sw),
      this.pp_.apply(this, ne)
    )
  }

  private static mm_(paths) {
    const r: google.maps.LatLng[][] = []
    for (let i = 0; i < paths.length; ++i) {
      r.push(this.ll_(paths[i]))
    }
    return r
  }

  private static ll_(path: [number, number][]) {
    const r: google.maps.LatLng[] = []
    for (let i = 0; i < path.length; ++i) {
      r.push(this.pp_.apply(this, path[i]))
    }
    return r
  }
}

export { OverlayJson }