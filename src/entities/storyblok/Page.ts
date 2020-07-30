import TeaserI from "./Teaser";

export default interface PageI {
  _uid: string,
  body: TeaserI[],
  title: string,
  subtitle: string,
  component: "page"
}