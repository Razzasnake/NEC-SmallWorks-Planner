<template>
  <v-breadcrumbs
    :items="items"
    large
  >
    <template #divider>
      <v-icon>{{ mdiChevronRight }}</v-icon>
    </template>
  </v-breadcrumbs>
</template>
<script lang='ts'>
import { Component, Vue, Prop } from "vue-property-decorator";
import { mdiChevronRight } from "@mdi/js";

/**
 * Breadcrumbs to let the user go to google drive easily
 */
@Component({
  name: "UploadsBreadcrumbs",
  components: {},
})
export default class Breadcrumbs extends Vue {
  /**
   * Google drive folder id
   */
  @Prop({ default: null })
  private folderId!: string;

  private mdiChevronRight = mdiChevronRight;
  private get items() {
    return [
      {
        text: "My Drive",
        disabled: false,
        href: "https://drive.google.com/drive/my-drive",
      },
      {
        text: "tableandmap.com",
        disabled: this.folderId === null,
        href: `https://drive.google.com/drive/folders/${this.folderId}`,
      },
    ];
  }
}
</script>