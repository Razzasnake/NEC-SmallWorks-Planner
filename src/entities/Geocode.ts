export default class Geocode {
  /**
   * geocod.io
   */
  public address_components!: {
    number: string,
    predirectional: string,
    street: string,
    suffix: string,
    formatted_street: string,
    city: string,
    county: string,
    state: string,
    zip: string,
    country: string
  };
  public formatted_address!: string;
  public location!: {
    lat: number,
    lng: number
  };
  public accuracy!: number;
  public accuracy_type!: string;
  public source!: string;

  constructor(obj: { results: Geocode[]}) {
    Object.assign(this, obj.results[0]);
  }
}