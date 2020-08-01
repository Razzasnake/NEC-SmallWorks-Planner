<template>
  <div>
    <div v-if="footerValue">{{ footerValue }}</div>
    <a v-else @click="onClick" style="cursor: pointer;">
      <v-icon color="primary" style="font-size: 15px;">mdi-eye</v-icon>
    </a>
  </div>
</template>

<script lang='ts'>
import { Component, Vue } from "vue-property-decorator";
import { ICellRendererParams } from "@ag-grid-community/core";

@Component({
  components: {},
})
export default class AgGridLink extends Vue {
  private params!: ICellRendererParams;
  private get footerValue() {
    return this.params.data.preview;
  }
  private onClick() {
    /**
     * Open the preview card from a click in the table
     *
     * @type {string}
     */
    this.$parent.$parent.$emit("markerSelected", this.params.data.id);
  }
}
</script>