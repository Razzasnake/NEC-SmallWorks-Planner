<template>
  <div class="table-and-map">
    <div class="content">
      <div :id="mapId" style="height: 100%;">
        <GoogleMap
          v-if="map"
          :rowData="rowData"
          :hiddenMarkerIndices="hiddenMarkerIndices"
          :selectedMarkerIndices="selectedMarkerIndices"
          :summary="map.summary"
          :overlayEvents="overlayEvents"
          :createInfoWindow="createInfoWindow"
          :allowDraw="map.allowDraw"
          @markerSelected="markerSelected"
          @updateOverlayEvents="updateOverlayEvents"
        ></GoogleMap>
      </div>
      <div :id="tableId" style="height: 100%;">
        <AgGridVue
          style="height: 100%;"
          class="ag-grid ag-theme-balham"
          v-model="rowData"
          :columnDefs="tableLogic.columnDefs"
          :statusBar="tableLogic.statusBar"
          :defaultColDef="tableLogic.defaultColDef"
          :sideBar="tableLogic.defaultSideBar"
          :isExternalFilterPresent="isExternalFilterPresent"
          :doesExternalFilterPass="doesExternalFilterPass"
          :getRowNodeId="getRowNodeId"
          :fillOperation="fillOperation"
          :suppressMenuHide="true"
          :getContextMenuItems="tableLogic.getContextMenuItem"
          suppressRowClickSelection
          enableRangeSelection
          enableFillHandle
          undoRedoCellEditing
          rowSelection="multiple"
          @gridReady="gridReady"
          @data-model-changed="dataModelUpdated"
          @sortChanged="sortChanged"
          @filterChanged="filterChanged"
          @cellKeyPress="onCellKeyPress"
        ></AgGridVue>
      </div>
      <PreviewCard
        class="entity-preview"
        v-if="clickedMarker"
        :clickedMarker="clickedMarker"
        :uploadedFile="uploadedFile"
        @select="select"
        @deselect="deselect"
        @close="close"
      ></PreviewCard>
    </div>
  </div>
</template>
<script lang='ts'>
import { Component, Prop, Watch, Vue } from 'vue-property-decorator'
import { AgGridVue } from 'ag-grid-vue'
import PreviewCard from './PreviewCard/PreviewCard.vue'
// import 'ag-grid-enterprise'
import GoogleMap from './GoogleMap/GoogleMap.vue'
import Split from 'split.js'
import { cloneDeep } from 'lodash'
import { TableAndMapMap } from './Types'
import Utils from './GoogleMap/Utils'
import { GridApi, RowNode, CellKeyPressEvent, GridOptions } from 'ag-grid-community'
import TableLogic from './TableLogic'
import { LicenseManager } from "ag-grid-enterprise"
import UploadedFile, { Row } from '@/entities/UploadedFile'
// LicenseManager.setLicenseKey('[TRIAL]_19_May_2020_[v2]_MTU4OTg0NjQwMDAwMA==d1c6b5b83d825b730415f17032aea8c0')

/**
 * Display the uploaded file in a table and on a map.
 */
@Component({
  components: {
    GoogleMap,
    AgGridVue,
    PreviewCard
  }
})
export default class TableAndMap extends Vue {
  /**
   * All of the google markers to display in the table and map
   */
  @Prop()
  private uploadedFile!: UploadedFile
  /**
   * An object used to apply previous filters
   */
  @Prop({ default: () => {} })
  private filters!: { [colId: string]: any }
  /**
   * An array of objects to apply previous sorting
   */
  @Prop({ default: () => [] })
  private sorting!: { colId: string, sort: string }[]
  /**
   * Config for the map
   */
  @Prop({ default: null })
  private map!: TableAndMapMap | null
  /**
   * Config for the table, must specify the columns
   */
  @Prop()
  private tableLogic!: TableLogic

  private mapId = 'Map-' + Math.random().toString(36).substring(7)
  private tableId = 'Table-' + Math.random().toString(36).substring(7)
  private rowData: Row[] = []
  private hiddenMarkerIndices: Set<number> = new Set()
  private selectedMarkerIndices: Set<number> = new Set()
  private gridApi!:  GridApi
  private clickedMarker: Row | null = null

  private get overlayEvents(): google.maps.drawing.OverlayCompleteEvent[] {
    if (this.map) {
      return Utils.jsonToOverlayEvents(this.map.overlayEventJsons)
    }
    return []
  }

  @Watch('uploadedFile')
  private uploadedFileUpdated(): void {
    this.rowData = cloneDeep(this.uploadedFile.data.slice(this.uploadedFile.firstRowHeader ? 1 : 0))
    this.selectedMarkerIndices = new Set(this.uploadedFile.data.map((row, index) => {
      if (row.isSelected) {
        return index
      }
      return -1
    }).filter(_ => _ > -1))
  }

  private created(): void {
    this.uploadedFileUpdated()
  }

  private mounted(): void {
    if (document.getElementById(this.mapId) && document.getElementById(this.tableId)) {
      Split([`#${this.mapId}`, `#${this.tableId}`], {
        direction: 'vertical',
        sizes: [50, 50]
      })
    }
  }

  private createInfoWindow(marker: google.maps.Marker, row: Row): google.maps.InfoWindow | null {
    return new google.maps.InfoWindow({
      content: `TODO: Info Window - ${row.index}`
    })
  }

  private markerSelected(id: string): void {
    const clickedMarker = this.rowData.find(_ => _.id === id)
    if (clickedMarker) {
      this.clickedMarker = clickedMarker
    }
  }

  private updateOverlayEvents(overlayEvents: google.maps.drawing.OverlayCompleteEvent[]): void {
    const overlayEventJsons = Utils.overlayEventsToJson(overlayEvents)
     /**
      * Notify parent of newly drawn polygons on the map
      * 
      * @type {OverlayJson[]}
      */
    this.$emit('updateOverlayEventJsons', overlayEventJsons)
    this.$nextTick(() => {
      this.gridApi.onFilterChanged()
    })
  }

  private isExternalFilterPresent(): boolean {
    if (this.map) {
      return this.map.overlayEventJsons.length > 0
    }
    return false
  }

  private doesExternalFilterPass(node: RowNode) {
    const latLng = new google.maps.LatLng(node.data.lat, node.data.lng) 
    for (let i = 0; i < this.overlayEvents.length; i++) {
      const event = this.overlayEvents[i]
      let isContained: boolean = false
      if (event.type === google.maps.drawing.OverlayType.RECTANGLE) {
        const rectangle = event.overlay as google.maps.Rectangle
        isContained = rectangle.getBounds().contains(latLng)
      } else if (event.type === google.maps.drawing.OverlayType.POLYGON) {
        const polygon = event.overlay as google.maps.Polygon
        isContained = google.maps.geometry.poly.containsLocation(latLng, polygon)
      } else if (event.type === google.maps.drawing.OverlayType.CIRCLE) {
        const circle = event.overlay as google.maps.Circle
        isContained = circle.getBounds().contains(latLng) &&
          google.maps.geometry.spherical.computeDistanceBetween(circle.getCenter(), latLng) <= circle.getRadius()
      }
      if (isContained) {
        return true
      }
    }
    return false
  }

  private gridReady(config: { api: GridApi }) {
    this.gridApi = config.api
    this.gridApi.setFilterModel(this.filters)
    this.gridApi.setSortModel(this.sorting)
    this.updateVisibleRows()
  }

  private dataModelUpdated(rowData: Row[]) {
    const selectedMarkerIndices: Set<number> = new Set()
    const selectedMarkerIds: string[] = []
    rowData.forEach((row, index) => {
      if (row.isSelected) {
        selectedMarkerIndices.add(index)
        selectedMarkerIds.push(row.id)
      }
    })
    this.selectedMarkerIndices = selectedMarkerIndices
    /**
     * Update the selected rows
     *
     * @type {string[]}
     */
    this.$emit('rowSelectionsChanged', selectedMarkerIds)
  }

  private sortChanged() {
    /**
     * Update the sorting config
     *
     * @type {{ colId: string, sort: string }[]}
     */
    this.$emit('sortChanged', this.gridApi.getSortModel())
  }

  private filterChanged() {
    /**
     * Update the filter config
     *
     * @type {{ [colId: string]: any }}
     */
    this.$emit('filterChanged', this.gridApi.getFilterModel())
    this.updateVisibleRows()
  }

  private updateVisibleRows() {
    const visibleRowIds: Set<string> = new Set()
    this.gridApi.forEachNodeAfterFilter((node, index) => {
      visibleRowIds.add(node.data.id)
    })
    const hiddenMarkerIndices: Set<number> = new Set()
    this.rowData.forEach((marker, index) => {
      if (!visibleRowIds.has(marker.id)) {
        hiddenMarkerIndices.add(index)
      }
    })
    this.hiddenMarkerIndices = hiddenMarkerIndices
  }

  private getRowNodeId(data: Row): string {
    return data.id
  }

  private fillOperation(options: any) {
    if (options.column.colId === 'isSelected') {
      const toUse = options.initialValues[0]
      /* We have to use nextTick here. Cell ranges isn't updated until after next tick. */
      this.$nextTick(() => {
        const cellRanges = this.gridApi.getCellRanges()
        cellRanges.forEach(range => {
          if (range.startRow !== undefined && range.endRow !== undefined) {
            for (let i = range.startRow.rowIndex; i < range.endRow.rowIndex + 1; i++) {
              this.gridApi.getDisplayedRowAtIndex(i).setDataValue('isSelected', toUse)
            }
          }
        })
      })
    }
  }

  private select(ids: string[]): void {
    ids.forEach(id => {
      this.gridApi.getRowNode(id).setDataValue('isSelected', true)
    })
  }

  private deselect(ids: string[]): void {
    ids.forEach(id => {
      this.gridApi.getRowNode(id).setDataValue('isSelected', false)
    })
  }

  private close(): void {
    this.clickedMarker = null
  }

  private onCellKeyPress(e: CellKeyPressEvent): void {
    if (e.event && (e.event as KeyboardEvent).keyCode === 32) {
      e.node.setDataValue('isSelected', e.node.isSelected())
    }
  }
}
</script>
<style lang='scss'>
.table-and-map {
  height: 100%;
  .content {
    height: 100%;
    position: relative;
    .entity-preview {
      z-index: 160;
      position: absolute;
      top: -2px;
      right: 0px;
      width: 500px;
    }
  }
}
.gutter {
  background-color: #EEEEEE;
  background-repeat: no-repeat;
  background-position: 50%;
  &.gutter-vertical {
    background-image: url('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAB4AAAAFAQMAAABo7865AAAABlBMVEVHcEzMzMzyAv2sAAAAAXRSTlMAQObYZgAAABBJREFUeF5jOAMEEAIEEFwAn3kMwcB6I2AAAAAASUVORK5CYII=');
  }
  &:hover {
    cursor: row-resize;
  }
}
</style>
<style lang='scss' scoped>
@import '~ag-grid-community/dist/styles/ag-grid.css';
@import '~ag-grid-community/dist/styles/ag-theme-balham.css';
</style>