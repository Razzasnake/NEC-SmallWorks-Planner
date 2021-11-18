<template>
  <v-dialog
    v-model="visible"
    max-width="700"
    @click:outside="closeModal"
  >
    <Loading :loading="isLoading" />
    <v-card>
      <v-card-title class="headline">
        Paste a dataset
      </v-card-title>
      <v-card-text>
        <div class="margin-bottom-large">
          {{ description }}
        </div>
        <v-text-field
          v-model="datasetUrl"
          placeholder="https://google.com"
          outlined
          :disabled="text.length > 0"
          label="Dataset URL"
        />
        <div class="margin-bottom-small">OR</div>
        <v-textarea
          v-model="text"
          :disabled="datasetUrl.length > 0"
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
import Loading from "@/components/Shared/Loading/Loading.vue";

/**
 * Textarea that allows the user to paste in a csv
 */
@Component({
  name: "UploadWorkflowUploadPasteModal",
  components: {
    Loading
  },
})
export default class PasteModal extends Vue {
  private text: string = "";
  private datasetUrl: string = "";
  private description: string =
    "Copy a dataset from an excel or csv file (including the header) or json file and paste it into the text box below. You may also enter a URL to the dataset and we will retrieve it for you.";
  private placeholder: string =
    "Street Address,City,State,Zip Code,Latitude,Longitude\n1600 Amphitheatre Pkwy,Mountain View,CA,94043,37.423432,-122.078865";
  private visible: boolean = true;
  private isLoading: boolean = false;

  private get finishIsDisabled() {
    return this.text === "" && this.datasetUrl === "";
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
    if (this.datasetUrl) {
      this.isLoading = true;
      fetch(this.datasetUrl).then(async response => {
        this.$emit("upload-text", await response.text());
        this.closeModal();
      }).finally(() => {
        this.isLoading = false;
      });
    } else {
      this.$emit("upload-text", this.text);
      this.closeModal();
    }
  }

  private beforeDestroy() {
    this.closeModal();
  }
}
</script>
<style scoped lang="scss">
::v-deep .v-text-field__details {
  display: none;
}
</style>