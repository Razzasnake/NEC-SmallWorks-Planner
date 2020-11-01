<template>
  <v-dialog
    v-model="visible"
    max-width="700"
    @click:outside="closeModal"
  >
    <v-card>
      <v-card-title class="headline">
        Paste a dataset
      </v-card-title>
      <v-card-text>
        <div class="margin-bottom-large">
          {{ description }}
        </div>
        <v-textarea
          v-model="text"
          outlined
          flat
          :placeholder="placeholder"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          text
          @click="closeModal"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          text
          :disabled="finishIsDisabled"
          @click="uploadText"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";

/**
 * Textarea that allows the user to paste in a csv
 */
@Component({
  name: "UploadWorkflowUploadPasteModal",
  components: {},
})
export default class PasteModal extends Vue {
  private text: string = "";
  private description: string =
    "Copy a dataset from an excel or csv file (including the header) and paste it into the text box below.";
  private placeholder: string =
    "Street Address,City,State,Zip Code,Latitude,Longitude\n1600 Amphitheatre Pkwy,Mountain View,CA,94043,37.423432,-122.078865";
  private visible: boolean = true;

  private get finishIsDisabled() {
    return this.text === "";
  }

  private closeModal() {
    /**
     * Close the modal
     */
    this.$emit("close-modal");
  }

  private uploadText() {
    /**
     * Emit the uploaded text
     *
     * @type {{string}}
     */
    this.$emit("upload-text", this.text);
    this.closeModal();
  }

  private beforeDestroy() {
    this.closeModal();
  }
}
</script>