import { Vue } from "vue-property-decorator";

export default class _View extends Vue {
  protected title: string = "Table & Map - Visualize your location data";
  protected content: string = "Visualize your location data in an interactive map. Upload an excel or csv file with addresses or latitudes and longitudes to get started.";

  protected activated(config?: { title?: string | undefined, content?: string | undefined } | undefined) {
    document.title = (config && config.title) ? config.title : this.title;
    const title = document.getElementsByName("title");
    if (title.length) {
      (title[0] as HTMLMetaElement).content = document.title;
    }
    const description = document.getElementsByName("description");
    if (description.length) {
      (description[0] as HTMLMetaElement).content = (config && config.content) ? config.content : this.content;
    }
  }
}