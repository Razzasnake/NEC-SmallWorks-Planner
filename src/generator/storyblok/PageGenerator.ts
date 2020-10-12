import { teasersGenerator } from "./TeaserGenerator";
import { exampleTeasersGenerator } from './ExampleTeaserGenerator';
import PageI from "@/entities/storyblok/Page";

const pageGenerator = (useExamples: boolean = false): PageI => {
  return {
    _uid: "b0e1584b-e2de-4415-99a2-82cb2a285ac2",
    body: useExamples ? exampleTeasersGenerator() : teasersGenerator(),
    title: "Features",
    subtitle: "Learn more about the many features offered by Table & Map",
    component: "page",
    preview: {
      filename: require("@/assets/examples/nationalparks.jpg")
    }
  }
}

export { pageGenerator }