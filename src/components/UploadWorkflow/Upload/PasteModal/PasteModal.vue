<template>
  <div class="modal is-active">
    <div class="modal-background"></div>
    <div class="modal-card">
      <header class="modal-card-head">
        <p class="modal-card-title">Paste a dataset</p>
        <button class="delete" @click="closeModal"></button>
      </header>
      <section class="modal-card-body">
        <b-input type="textarea" v-model="text"></b-input>
      </section>
      <footer class="modal-card-foot">
        <div class="field is-grouped">
          <div class="control">
            <b-button class="is-primary" @click="uploadText" :disabled="finishIsDisabled">Finish</b-button>
          </div>
        </div>
      </footer>
    </div>
  </div>
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