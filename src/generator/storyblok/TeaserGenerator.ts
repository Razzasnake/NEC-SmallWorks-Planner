import TeaserI from "@/entities/storyblok/Teaser";

const teaserGenerator = (): TeaserI => {
  return {
    _uid: "cf617342-cb25-4bb7-8795-cb0e42728199",
    title: "GeoJSON and Shapefile Layers",
    feature: {
      id: "6693dcde-098d-476c-9bef-2c6a1ec76ef1",
      url: "",
      linktype: "story",
      fieldtype: "multilink",
      cached_url: "feature/geojson-and-shapefile-layers"
    },
    preview: {
      id: 1278733,
      alt: null,
      name: "",
      focus: null,
      title: null,
      filename: require("@/assets/examples/covid19/covid19.jpg"),
      copyright: null,
      fieldtype: "asset"
    },
    component: "teaser",
    description: "Upload GeoJSON and Shapefiles to visualize the regions markers fall within."
  }
}

const teasersGenerator = (num: number = 8) => {
  const teasers: TeaserI[] = [];
  for (let i = 0; i < num; i++) {
    teasers.push(teaserGenerator());
  }
  return teasers;
}

export { teaserGenerator, teasersGenerator }