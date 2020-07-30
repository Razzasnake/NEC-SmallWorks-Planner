import FeatureI from "./Feature";

export default interface PageI {
  _uid: string,
  body: FeatureI[],
  title: string,
  subtitle: string,
  component: "page"
}