import { RichText, Asset, Link } from "./Base";

export default interface FeatureI {
  _uid: string,
  title: RichText,
  content: RichText,
  preview: Asset,
  subtitle: RichText,
  component: "feature",
  youtubeUrl: Link
}