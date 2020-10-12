import ExampleTeaserI from '@/entities/storyblok/ExampleTeaser';

export const examples: ExampleTeaserI[] = [
  {
    lat: 2,
    lng: 1,
    type: "Nature",
    title: "US National Parks",
    github: {
      url: "https://gist.githubusercontent.com/tjgambs/9d274cbacf4bfe9b08a440499512e6f7/raw/0269ecf1117475871d0d504a67ac195facc9b588/national_parks.csv"
    },
    feature: {
      url: "/explore/us-national-parks"
    },
    preview: {
      filename: require("@/assets/examples/nationalparks.jpg")
    },
    description: "The United States has 62 national parks. Included in this dataset are the locations of each.",
    firstRowHeader: true
  },
  {
    lat: 1,
    lng: 0,
    type: "Nature",
    title: "US and Canada Campgrounds",
    github: {
      url: "https://gist.githubusercontent.com/tjgambs/b5db1dcdc4e6f387a99d17823ee2c480/raw/6e7eb3a91936af4c07ba62f30a18f2b3248bb38c/uscanadacampgrounds.csv"
    },
    feature: {
      url: "/explore/us-and-canada-campgrounds"
    },
    preview: {
      filename: require("@/assets/examples/campgrounds.jpg")
    },
    description: "Locations of all campgrounds in the United States and Canada.",
    firstRowHeader: true
  },
  {
    lat: 1,
    lng: 0,
    type: "Nature",
    title: "Glacier National Park",
    github: {
      url: "https://gist.githubusercontent.com/tjgambs/d0ea5a0554e9b32a166143fcc03b6fad/raw/bbcbe700d4342ed108f5445eb547f52f8011fc66/glacier_poi.csv"
    },
    feature: {
      url: "/explore/glacier-national-park"
    },
    preview: {
      filename: require("@/assets/examples/glacier.jpg")
    },
    description: "Viewpoints, picnic areas, parking, campgrounds and more points of interest in Glacier National Park.",
    firstRowHeader: true
  },
  {
    lat: 15,
    lng: 17,
    type: "Food & Drink",
    title: "Vegan and Vegetarian Restaurants",
    github: {
      url: "https://gist.githubusercontent.com/tjgambs/e3e3fef726b93cc931d40dad580b8b59/raw/02d216088f950c20857ded375b36e04a177eba0d/vegetarian_restaurants.csv"
    },
    feature: {
      url: "/explore/vegan-and-vegetarian-restaurants"
    },
    preview: {
      filename: require("@/assets/examples/vegan.jpg")
    },
    description: "Vegan and vegetarian friendly restaurants in the United States.",
    firstRowHeader: true
  },
  {
    lat: 13,
    lng: 14,
    type: "Food & Drink",
    title: "Breweries",
    github: {
      url: "https://gist.githubusercontent.com/tjgambs/cc790ce4aca21f7f97195d2edd91c5f3/raw/ebc99abf4a0cf302f97ec00f3a6648b0adacabc1/breweries.csv"
    },
    feature: {
      url: "/explore/breweries"
    },
    preview: {
      filename: require("@/assets/examples/breweries.jpg")
    },
    description: "A sample of breweries and bars that can be found across the world.",
    firstRowHeader: true
  },
  {
    lat: 8,
    lng: 9,
    type: "Food & Drink",
    title: "Fast Food Locations",
    github: {
      url: "https://gist.githubusercontent.com/tjgambs/3c00b0a9d78b96fe1429e31966823b9d/raw/f0a1c745ee097377abf63375b9e727a2c76438a7/fast_food.csv"
    },
    feature: {
      url: "/explore/fast-food-locations"
    },
    preview: {
      filename: require("@/assets/examples/fastfood.jpg") 
    },
    description: "A sample of all the fast food locations in the United States.",
    firstRowHeader: true
  }
]