import ExampleTeaserI from "@/entities/storyblok/ExampleTeaser";

const exampleTeaserGenerator = (): ExampleTeaserI => {
  return {
    lat: 8,
    lng: 9,
    _uid: Math.random().toString(36).substring(7),
    title: "Covid-19 Confirmed Cases US",
    github: {
      id: "",
      url: "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv",
      linktype: "url",
      fieldtype: "multilink",
      cached_url: "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"
    },
    feature: {
      id: "",
      url: "/explore/covid-19-confirmed-cases-us",
      linktype: "url",
      fieldtype: "multilink",
      cached_url: "/explore/covid-19-confirmed-cases-us"
    },
    preview: {
      id: 1284687,
      alt: null,
      name: "",
      focus: null,
      title: null,
      filename: require("@/assets/examples/covid19/covid19.jpg"),
      copyright: null,
      fieldtype: "asset"
    },
    component: "exampleTeaser",
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