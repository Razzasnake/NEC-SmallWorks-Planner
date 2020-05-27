export default class UploadWorkflowLogic {
  public static guessColumnTypes(data: any[][]) {
    const columnSelections: {
      lat: null | number;
      lng: null | number;
      address: null | number;
      city: null | number;
      state: null | number;
      zip: null | number;
    } = {
      lat: null,
      lng: null,
      address: null,
      city: null,
      state: null,
      zip: null
    };
    const latTerms = new Set(["latitude", "lat"]);
    const lngTerms = new Set(["longitude", "lng", "lon"]);
    const addressTerms = new Set(["address", "streetaddress"]);
    const cityTerms = new Set(["city"]);
    const stateTerms = new Set(["state", "st"]);
    const zipTerms = new Set(["zip", "zipcode"]);
    if (data.length) {
      data[0].forEach((h, index) => {
        const cleanH = h.toString().toLowerCase().replace(/[^a-zA-Z]+/g, '');
        if (latTerms.has(cleanH)) {
          columnSelections.lat = index;
        } else if (lngTerms.has(cleanH)) {
          columnSelections.lng = index;
        } else if (addressTerms.has(cleanH)) {
          columnSelections.address = index;
        } else if (cityTerms.has(cleanH)) {
          columnSelections.city = index;
        } else if (stateTerms.has(cleanH)) {
          columnSelections.state = index;
        } else if (zipTerms.has(cleanH)) {
          columnSelections.zip = index;
        }
      });
      // TODO: If we can't find perfect equality, let's see if it contains the string
    }
    return columnSelections
  }

  public static guessFirstRowHeader(data: any[][]) {
    if (data.length === 0) {
      return false;
    }
    const notStrings = data[0].filter(_ => typeof _ !== 'string')
    return notStrings.length === 0
  }
}