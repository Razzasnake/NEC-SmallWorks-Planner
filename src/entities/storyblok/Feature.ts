import { RichText, Asset, Link } from "./Base";

export default interface FeatureI {
  _uid: string,
  title: string,
  content: RichText,
  preview: Asset,
  abstract: RichText,
  subtitle: string,
  component: string,
  youtubeUrl: Link
}