import TeaserI from "@/entities/storyblok/Teaser";

const teaserGenerator = (): TeaserI => {
  return {
    title: "GeoJSON and Shapefile Layers",
    feature: {
      url: "feature/geojson-and-shapefile-layers"
    },
    preview: {
      filename: require("@/assets/examples/nationalparks.jpg")
    },
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