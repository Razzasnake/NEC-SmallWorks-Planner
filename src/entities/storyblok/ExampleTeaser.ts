import TeaserI from "./Teaser";

export default interface ExampleTeaserI extends TeaserI {
  lat: number,
  lng: number,
  firstRowHeader: boolean
}