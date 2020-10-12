<template>
  <BasePage
    title="Pricing"
    subtitle="Choose the plan that's right for you or your business."
    :img="require('@/assets/mapwithmarkers.jpg')"
    @finish="finish"
  >
    <Tiers />
  </BasePage>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import UploadedFile from "@/entities/UploadedFile";
import BasePage from "@/components/Shared/Page/Page.vue";
import Tiers from "../Tiers/Tiers.vue";

/**
 * Pricing page
 */
@Component({
  components: {
    BasePage,
    Tiers
  },
})
export default class Page extends Vue {
  private finish(uploadedFile: UploadedFile) {
    /**
     * Emit the uploaded file
     *
     * @type {UploadedFile}
     */
    this.$emit("finish", uploadedFile);
  }
}
</script>
<style lang="scss" scoped>
</style>
