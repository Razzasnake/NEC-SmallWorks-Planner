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
    this.$router.push({ name: "Explore" });
  }
}
</script>