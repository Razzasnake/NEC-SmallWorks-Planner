<template>
  <v-dialog v-model="visible" @click:outside="closeModal" max-width="700">
    <v-card>
      <v-card-title class="headline">Paste a dataset</v-card-title>
      <v-card-text>
        <div class="margin-bottom-large">{{ description }}</div>
        <b-input type="textarea" :placeholder="placeholder" v-model="text"></b-input>
      </v-card-text>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn color="primary" text @click="closeModal">Cancel</v-btn>
        <v-btn color="primary" text @click="uploadText" :disabled="finishIsDisabled">Confirm</v-btn>
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
  components: {}
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
    this.$emit("closeModal");
  }

  private uploadText() {
    /**
     * Emit the uploaded text
     *
     * @type {{string}}
     */
    this.$emit("uploadText", this.text);
    this.closeModal();
  }

  private beforeDestroy() {
    this.closeModal();
  }
}
</script>
<style lang='scss' scoped>
</style>