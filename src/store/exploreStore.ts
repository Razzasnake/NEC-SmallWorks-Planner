import Vue from "vue";
import UploadedFile from "@/entities/UploadedFile";
import { TableAndMapMap } from "@/components/TableAndMap/Types";
import TableLogic from "@/components/TableAndMap/Table/TableLogic";
import { OverlayJson } from "@/components/TableAndMap/GoogleMap/Utils";

interface ExploreStoreI {
  uploadedFile: UploadedFile | null,
  filters: { [colId: string]: any },
  sorting: { colId: string; sort: string }[],
  map: TableAndMapMap,
  tableLogic: TableLogic | null,
  viewOptions: string[]
};

const state: ExploreStoreI = Vue.observable({
  uploadedFile: null,
  filters: {},
  sorting: [],
  map: {
    overlayEventJsons: [],
    infoWindowKeys: [],
    allowDraw: true
  },
  tableLogic: null,
  viewOptions: ["map", "table"]
});

export const updateUploadedFile = (uploadedFile: UploadedFile) => {
  state.uploadedFile = uploadedFile;
  state.tableLogic = new TableLogic(uploadedFile);
}

export const updateOverlayEventJsons = (overlayEventJsons: OverlayJson[]) => {
  state.map.overlayEventJsons = overlayEventJsons;
}

export const updateSorting = (sorting: { colId: string; sort: string }[]) => {
  state.sorting = sorting;
}

export const updateFilters = (filters: { [colId: string]: any }) => {
  state.filters = filters;
}

export const updateViewOptions = (viewOptions: string[]) => {
  state.viewOptions = viewOptions;
}

export const createPolygonForeignKey = () => {
  const polygonHash = `polygon_${Math.random()
    .toString(36)
    .substring(2, 15)}`
  if (state.uploadedFile) {
    state.uploadedFile.data.forEach(d => {
      d[polygonHash] = null
    })
    state.tableLogic = new TableLogic(state.uploadedFile!);
  }
  return polygonHash;
}

export const updatePolygonForeignKeys = (fk: { polygonHash: string, index: number, polygons: google.maps.Data.Feature[] }) => {
  if (state.uploadedFile) {
    state.uploadedFile.data[fk.index][fk.polygonHash] = fk.polygons
  }
}

export const reset = () => {
  state.uploadedFile = null;
  state.filters = {};
  state.sorting = [];
  state.map = {
    overlayEventJsons: [],
    infoWindowKeys: [],
    allowDraw: true
  };
  state.tableLogic = null;
  state.viewOptions = ["map", "table"];
}

export default state;