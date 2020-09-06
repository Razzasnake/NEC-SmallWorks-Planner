<template>
  <v-breadcrumbs :items="items" large>
    <template v-slot:divider>
      <v-icon>{{ mdiChevronRight }}</v-icon>
    </template>
  </v-breadcrumbs>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { mdiChevronRight } from "@mdi/js";
import state from "@/store/driveStore";

/**
 * Breadcrumbs to let the user go to google drive easily
 */
@Component({
  components: {},
})
export default class Breaadcrumbs extends Vue {
  private items = [
    {
      text: "My Drive",
      disabled: false,
      href: "https://drive.google.com/drive/my-drive",
    },
    {
      text: "tableandmap.com",
      disabled: state.folderId === null,
      href: `https://drive.google.com/drive/folders/${state.folderId}`,
    },
  ];
  private mdiChevronRight = mdiChevronRight;
}
</script>