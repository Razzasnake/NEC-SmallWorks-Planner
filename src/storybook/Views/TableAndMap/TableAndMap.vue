<template>
  <div>
    <div :id="mapId">
      <Map :uploadedFile="uploadedFile" @markerClicked="markerClicked"></Map>
    </div>
    <div :id="tableId">
      <Table
        style="height: 100%;"
        :uploadedFile="uploadedFile"
        :filters="filters"
        :sorting="sorting"
        @sortChanged="sortChanged"
        @filterChanged="filterChanged"
      ></Table>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Vue } from "vue-property-decorator";
import Map from "./Map/Map.vue";
import Table from "./Table/Table.vue";
import Split from "split.js";
import UploadedFile from "@/entities/UploadedFile";

/**
 * Display the uploaded file on a map and in a table
 */
@Component({
  components: {
    Map,
    Table
  }
})
export default class TableAndMap extends Vue {
  /**
   * Uploaded file to be displayed in the table and on the map
   */
  @Prop()
  private uploadedFile!: UploadedFile[];
  private filters: { [colId: string]: any }[] = [];
  private sorting: { colId: string; sort: string }[] = [];

  private mapId =
    "Map-" +
    Math.random()
      .toString(36)
      .substring(7);
  private tableId =
    "Table-" +
    Math.random()
      .toString(36)
      .substring(7);

  private mounted() {
    Split([`#${this.mapId}`, `#${this.tableId}`], {
      direction: "vertical",
      sizes: [50, 50]
    });
  }

  private markerClicked() {}
  private sortChanged() {}
  private filterChanged() {}
}
</script>
<style lang='scss'>
.gutter {
  background-color: #f5f5f5;
  background-repeat: no-repeat;
  background-position: 50%;
  &.gutter-vertical {
    background-image: url("data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=");
  }
  &:hover {
    cursor: row-resize;
  }
}
</style>