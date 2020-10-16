<template>
  <v-dialog
    v-model="dialog"
    width="500"
  >
    <v-card>
      <v-card-title>Rename</v-card-title>
      <v-card-text>
        <v-text-field
          v-model="value"
          label="Name"
          class="full-width"
        />
      </v-card-text>
      <v-card-actions>
        <v-spacer />
        <v-btn
          color="primary"
          text
          @click="cancel"
        >
          Cancel
        </v-btn>
        <v-btn
          color="primary"
          :disabled="value.length === 0"
          text
          @click="confirm"
        >
          Confirm
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";

/**
 * Modal where users can rename their file
 */
@Component({
  components: {},
})
export default class RenameModal extends Vue {
  /**
   * Current name of the file
   */
  @Prop({ default: "" })
  private name!: string;
  private value: string = "";
  private dialogAux: boolean = true;

  private get dialog(): boolean {
    return this.dialogAux;
  }
  private set dialog(newValue: boolean) {
    if (!newValue) {
      this.cancel();
    }
    this.dialogAux = newValue;
  }

  private created() {
    this.value = this.name.split(".").slice(0, -2).join(".");
  }

  private confirm() {
    const suffix = this.name.split(".").slice(-2).join(".");
    /**
     * Update the file name
     *
     * @type {string}
     */
    this.$emit("confirm", `${this.value}.${suffix}`);
  }

  private cancel() {
    /**
     * Close the modal, don't update the filename
     */
    this.$emit("cancel");
  }
}
</script>
<style lang="scss" scoped>
</style>