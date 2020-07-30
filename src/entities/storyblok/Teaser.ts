import { Asset, Link } from "./Base";

export default interface TeaserI {
  _uid: string,
  title: string,
  feature: Link,
  preview: Asset,
  component: "teaser",
  description: string
}