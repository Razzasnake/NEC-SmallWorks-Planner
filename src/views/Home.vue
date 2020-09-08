<template>
  <HomeComponent @finish="finish" />
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import HomeComponent from "@/components/Home/Home/Home.vue";
import UploadedFile from "@/entities/UploadedFile";
import { updateUploadedFile } from "@/store/exploreStore";

/**
 * Home page to display to first visitors
 */
@Component({
  components: {
    HomeComponent,
  },
})
export default class Home extends Vue {
  private finish(uploadedFile: UploadedFile) {
    updateUploadedFile(uploadedFile);
  }

  private activated() {
    document.title = "Table & Map - Visualize your location data";
    const title = document.getElementsByName("title");
    if (title.length) {
      (title[0] as HTMLMetaElement).content = document.title;
    }
    const description = document.getElementsByName("description");
    if (description.length) {
      (description[0] as HTMLMetaElement).content =
        "Visualize your location data in an interactive map. Upload an excel or csv file with addresses or latitudes and longitudes to get started.";
    }
  }
}
</script>