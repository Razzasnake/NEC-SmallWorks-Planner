import ExampleTeaserI from "@/entities/storyblok/ExampleTeaser";

const exampleTeaserGenerator = (): ExampleTeaserI => {
  return {
    lat: 8,
    lng: 9,
    _uid: Math.random().toString(36).substring(7),
    title: "Covid-19 Confirmed Cases US",
    feature: {
      id: "",
      url: "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv",
      linktype: "url",
      fieldtype: "multilink",
      cached_url: "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_confirmed_US.csv"
    },
    preview: {
      id: 1284687,
      alt: null,
      name: "",
      focus: null,
      title: null,
      filename: "https://a.storyblok.com/f/89733/1600x685/eff1378677/covid19.jpg",
      copyright: null,
      fieldtype: "asset"
    },
    component: "exampleTeaser",
    description: "Daily time series data for confirmed Covid-19 cases in the United States.",
    firstRowHeader: true
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