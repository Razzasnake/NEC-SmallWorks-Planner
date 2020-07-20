import Vue from "vue";
import UploadedFile from "@/entities/UploadedFile";
import { TableAndMapMap } from "@/components/TableAndMap/Types";
import TableLogic from "@/components/TableAndMap/Table/Logic/TableLogic";
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

export const createFeature = (fileName: string) => {
  if (state.uploadedFile) {
    state.uploadedFile.data.forEach(d => {
      d.features.push({
        name: fileName,
        features: null
      })
    })
  }
}

export const updateFeature = (fk: { featureIndex: number, index: number, features: google.maps.Data.Feature[] }) => {
  if (state.uploadedFile) {
    state.uploadedFile.data[fk.index].features[fk.featureIndex] = {
      name: state.uploadedFile.data[fk.index].features[fk.featureIndex].name,
      features: fk.features
    }
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