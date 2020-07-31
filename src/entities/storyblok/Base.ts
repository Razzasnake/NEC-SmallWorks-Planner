export type RichText = object;

export interface Asset {
  id: number | null,
  alt: string | null,
  name: string,
  focus: string | null,
  title: string | null,
  filename: string,
  copyright: string | null,
  fieldtype: string
}

export interface Link {
  id: string,
  url: string,
  linktype: string,
  fieldtype: string,
  cached_url: string
}