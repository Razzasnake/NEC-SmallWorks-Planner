export default class UploadWorkflowLogic {
  public static guessColumnTypes(data: any[][]) {
    const columnSelections: {lat: null | number, lng: null | number} = {
      lat: null,
      lng: null
    }
    const latTerms = new Set(["latitude", "lat"]);
    const lngTerms = new Set(["longitude", "lng", "lon"]);
    if (data.length) {
      data[0].forEach((h, index) => {
        const cleanH = h.toLowerCase();
        if (latTerms.has(cleanH)) {
          columnSelections.lat = index;
        } else if (lngTerms.has(cleanH)) {
          columnSelections.lng = index;
        }
      });
    }
    return columnSelections
  }

  public static guessFirstRowHeader(data: any[][]) {
    const notStrings = data[0].filter(_ => typeof _ !== 'string')
    return notStrings.length === 0
  }
}