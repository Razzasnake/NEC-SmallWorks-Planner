import TeaserI from "./Teaser";
import { Link } from "./Base";

export default interface ExampleTeaserI extends TeaserI {
  lat: number,
  lng: number,
  firstRowHeader: boolean,
  type: string,
  github: Link,
}