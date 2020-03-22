<template>
  <div>
    <b-field label="First Row Header">
      <b-checkbox v-model="firstRowHeaderAux"></b-checkbox>
    </b-field>
    <b-field label="Latitude">
      <b-autocomplete
        v-model="latSearch"
        placeholder="Search for a column"
        :data="filterOptions(latSearch)"
        @input="latSelect"
        open-on-focus
        keep-first
        clearable
      ></b-autocomplete>
    </b-field>
    <b-field label="Longitude">
      <b-autocomplete
        v-model="lngSearch"
        placeholder="Search for a column"
        :data="filterOptions(lngSearch)"
        @input="lngSelect"
        open-on-focus
        keep-first
        clearable
      ></b-autocomplete>
    </b-field>
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
  /**
   * The row that contains the headers for this file.
   */
  @Prop()
  private firstRowHeader!: boolean;

  private latSearch: string = "";
  private lngSearch: string = "";

  private get firstRowHeaderAux() {
    return this.firstRowHeader;
  }

  private set firstRowHeaderAux(newVal: boolean) {
    this.$emit("updateFirstRowHeader", newVal);
  }

  private get allOptions(): string[] {
    if (this.firstRowHeader) {
      return this.value[0].map(_ => _.toString());
    } else {
      return this.value[0].map((_, index) => `Column ${index.toString()}`);
    }
  }

  @Watch("columnSelections")
  private columnSelectionsUpdated() {
    this.updateSearchs();
  }

  private created() {
    this.updateSearchs();
  }

  private updateSearchs() {
    if (this.columnSelections.lat !== null) {
      this.latSearch = this.allOptions[this.columnSelections.lat];
    } else {
      this.latSearch = "";
    }
    if (this.columnSelections.lng !== null) {
      this.lngSearch = this.allOptions[this.columnSelections.lng];
    } else {
      this.lngSearch = "";
    }
  }

  private filterOptions(search: string | undefined) {
    if (!search) {
      return this.allOptions;
    }
    return this.allOptions.filter(option => {
      return (
        option
          .toString()
          .toLowerCase()
          .indexOf(search.toLowerCase()) >= 0
      );
    });
  }

  private latSelect(latSearch: string) {
    const columnSelectionsAux = Object.assign({}, this.columnSelections);
    const index = this.allOptions.indexOf(latSearch);
    if (index >= 0) {
      columnSelectionsAux.lat = index;
      if (columnSelectionsAux.lng === index) {
        columnSelectionsAux.lng = null;
      }
    } else {
      columnSelectionsAux.lat = null;
    }
    this.$emit("updateSelections", columnSelectionsAux);
  }

  private lngSelect(lngSearch: string) {
    const columnSelectionsAux = Object.assign({}, this.columnSelections);
    const index = this.allOptions.indexOf(lngSearch);
    if (index >= 0) {
      columnSelectionsAux.lng = index;
      if (columnSelectionsAux.lat === index) {
        columnSelectionsAux.lat = null;
      }
    } else {
      columnSelectionsAux.lng = null;
    }
    this.$emit("updateSelections", columnSelectionsAux);
  }
}
</script>
<style lang='scss' scoped>
</style>