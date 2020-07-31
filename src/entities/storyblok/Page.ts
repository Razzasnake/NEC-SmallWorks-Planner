import { Asset } from "./Base";
import TeaserI from "./Teaser";

export default interface PageI {
  _uid: string,
  body: TeaserI[],
  title: string,
  subtitle: string,
  preview: Asset,
  component: string
}