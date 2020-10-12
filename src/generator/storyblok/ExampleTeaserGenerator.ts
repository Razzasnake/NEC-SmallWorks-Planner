import ExampleTeaserI from "@/entities/storyblok/ExampleTeaser";

const exampleTeaserGenerator = (): ExampleTeaserI => {
  return {
    lat: 8,
    lng: 9,
    title: "Covid-19 Confirmed Cases US",
    github: {
      url: "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"
    },
    feature: {
      url: "/explore/covid-19-confirmed-cases-us"
    },
    preview: {
      filename: require("@/assets/examples/nationalparks.jpg")
    },
    description: "Daily time series data for confirmed Covid-19 cases in the United States.",
    firstRowHeader: true,
    type: "Nature"
  }
}

const exampleTeasersGenerator = (num: number = 2) => {
  const teasers: ExampleTeaserI[] = [];
  for (let i = 0; i < num; i++) {
    teasers.push(exampleTeaserGenerator());
  }
  return teasers;
}

export { exampleTeaserGenerator, exampleTeasersGenerator }