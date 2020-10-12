import { Asset, Link } from "./Base";

export default interface TeaserI {
  title: string,
  feature: Link,
  preview: Asset,
  description: string
}