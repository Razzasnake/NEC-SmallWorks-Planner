import FeatureI from "./Feature";
import PageI from "./Page";

export default interface StoryI {
  name: string,
  created_at: string,
  published_at: string,
  alternates: string[],
  id: number,
  uuid: string,
  content: FeatureI | PageI,
  slug: string,
  full_slug: string,
  default_full_slug: string | null,
  sort_by_date: string | null,
  position: number,
  tag_list: string[],
  is_startpage: boolean,
  parent_id: number,
  meta_data: any,
  group_id: string,
  first_published_at: string,
  release_id: number | null,
  lang: "default",
  path: string | null,
  translated_slugs: string[]
}