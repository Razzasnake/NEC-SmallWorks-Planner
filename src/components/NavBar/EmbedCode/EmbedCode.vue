<template>
  <v-dialog
    v-model="visible"
    max-width="600"
    @click:outside="close"
  >
    <v-card>
      <v-card-title class="headline">
        Embed Code
      </v-card-title>
      <v-card-subtitle>
        Copy and paste the embed code below into your website's HTML to embed
        this Map.
      </v-card-subtitle>
      <v-card-text class="card-text-area">
        <v-textarea
          :value="embedCode"
          outlined
          flat
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          text
          color="primary"
          @click="close"
        >
          Close
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import driveState from "@/store/driveStore";
import state from "@/store/exploreStore";

/**
 * Modal to allow customers to copy the embed code
 */
@Component({
  name: "NavBarEmbedCode",
  components: {},
})
export default class EmbedCode extends Vue {
  private visible: boolean = true;
  private get embedCode() {
    const configFile = driveState.files.find(
      (_) => _.name === `${state.uploadedFile!.fileName}.json`
    );
    return `<iframe height="500" width="500" src="${process.env.VUE_APP_BASE_URL}/embed/${configFile?.id}"></iframe>`;
  }

  private close() {
    this.visible = false;
    /**
     * Close the modal
     */
    this.$emit("close");
  }
}
</script>