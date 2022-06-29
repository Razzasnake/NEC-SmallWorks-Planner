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
        this Map. You <b>must</b> have this dataset set to Public under the
        permissions settings for this to work. 
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
    return `<iframe height="500" width="500" src="${process.env.VUE_APP_BASE_URL}/embed/${this.$route.params.fileId}"></iframe>`;
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