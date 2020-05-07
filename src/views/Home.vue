<template>
  <div class="coa">
    <CallToAction @finish="finish"></CallToAction>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import CallToAction from "@/components/Home/CallToAction/CallToAction.vue";
import UploadedFile from "@/entities/UploadedFile";
import { updateUploadedFile } from "@/store/exploreStore";

/**
 * Contain workflow to get a file uploaded
 */
@Component({
  components: {
    CallToAction
  }
})
export default class Home extends Vue {
  private finish(uploadedFile: UploadedFile) {
    updateUploadedFile(uploadedFile);
    this.$router.push({ name: "Explore" });
  }
}
</script>
<style lang='scss' scoped>
.coa {
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>