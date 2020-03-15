<template>
  <div style="width: 100%;">
    <b-table :data="tableData" :columns="tableColumns">
      <template slot="header" slot-scope="scope">
        <b-dropdown hoverable aria-role="list">
          <button class="button" slot="trigger">
            <span v-if="scope.index === columnSelectionsAux.lat">Latitude</span>
            <span v-else-if="scope.index === columnSelectionsAux.lng">Longitude</span>
            <span v-else>N/A</span>
            <b-icon icon="menu-down"></b-icon>
          </button>
          <b-dropdown-item aria-role="listitem" @click="latClicked(scope.index)">
            Latitude
            <b-icon v-if="scope.index === columnSelectionsAux.lat" icon="check" size="is-small"></b-icon>
          </b-dropdown-item>
          <b-dropdown-item aria-role="listitem" @click="lngClicked(scope.index)">
            Longitude
            <b-icon v-if="scope.index === columnSelectionsAux.lng" icon="check" size="is-small"></b-icon>
          </b-dropdown-item>
        </b-dropdown>
      </template>
    </b-table>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue, Watch } from "vue-property-decorator";

/**
 * Confirm our predictions for lat/lon or select them
 */
@Component({
  components: {}
})
export default class SelectColumns extends Vue {
  /**
   * Array of anything that came from the Upload step.
   */
  @Prop({ default: () => [] })
  private value!: any[][];
  /**
   * Initial column selections.
   */
  @Prop()
  private columnSelections!: { lat: null | number; lng: null | number };
  private columnSelectionsAux: {
    lat: null | number;
    lng: null | number;
  } = Object.assign({}, this.columnSelections);

  @Watch("columnSelections")
  private columnSelectionsUpdated() {
    this.columnSelectionsAux = Object.assign({}, this.columnSelections);
  }

  private mounted() {
    const latTerms = new Set(["latitude", "lat"]);
    const lngTerms = new Set(["longitude", "lng", "lon"]);
    if (this.value.length) {
      const headers = this.value[0];
      headers.forEach((h, index) => {
        const cleanH = h.toLowerCase();
        if (latTerms.has(cleanH)) {
          this.columnSelectionsAux.lat = index;
        } else if (lngTerms.has(cleanH)) {
          this.columnSelectionsAux.lng = index;
        }
      });
    }
    this.$emit("updateSelections", this.columnSelectionsAux);
  }

  private get tableData() {
    return this.value.slice(0, 5).map((row, rowIndex) => {
      const data: { [key: string]: any } = {};
      row.forEach((col, colIndex) => {
        data[colIndex.toString()] = col;
      });
      return data;
    });
  }

  private get tableColumns() {
    if (this.value[0]) {
      return this.value[0].map((col, colIndex) => {
        return { field: colIndex.toString(), label: colIndex.toString() };
      });
    }
  }

  private latClicked(index: number) {
    this.columnSelectionsAux.lat = index;
    if (this.columnSelectionsAux.lng === index) {
      this.columnSelectionsAux.lng = null;
    }
    this.$emit("updateSelections", this.columnSelectionsAux);
  }

  private lngClicked(index: number) {
    this.columnSelectionsAux.lng = index;
    if (this.columnSelectionsAux.lat === index) {
      this.columnSelectionsAux.lat = null;
    }
    this.$emit("updateSelections", this.columnSelectionsAux);
  }
}
</script>
<style lang='scss' scoped>
</style>