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
  viewOptions: string[],
  polygonForeignKeys: { [polygonHash: string]: { [index: string]: google.maps.Data.Feature[] } }
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
  viewOptions: ["map", "table"],
  polygonForeignKeys: {}
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

export const updatePolygonForeignKeys = (fk: { polygonHash: string, index: number, polygons: google.maps.Data.Feature[] }) => {
  if (state.polygonForeignKeys[fk.polygonHash] === undefined) {
    state.polygonForeignKeys[fk.polygonHash] = {}
  }
  state.polygonForeignKeys[fk.polygonHash][fk.index.toString()] = fk.polygons;
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
  state.polygonForeignKeys = {};
}

export default state;