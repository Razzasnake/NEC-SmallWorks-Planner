import Vue from "vue";
import UploadedFile from "@/entities/UploadedFile";
import { TableAndMapMap } from "@/components/TableAndMap/Types";
import TableLogic from "@/components/TableAndMap/Table/Logic/TableLogic";
import { OverlayJson } from "@/components/TableAndMap/GoogleMap/Logic/Utils";
import ShapeParserWorker from "worker-loader!@/components/TableAndMap/GoogleMap/Logic/WebWorkers/ShapeParser.worker";

interface ExploreStoreI {
  uploadedFile: UploadedFile | null,
  filters: { [colId: string]: any },
  sorting: { colId: string; sort: string }[],
  map: TableAndMapMap,
  tableLogic: TableLogic | null,
  layers: { id: string, fileName: string, data: object }[],
  viewOptions: string[]
};

const state: ExploreStoreI = Vue.observable({
  uploadedFile: null,
  filters: {},
  sorting: [],
  map: {
    overlayEventJsons: [],
    infoWindowKeys: []
  },
  tableLogic: null,
  layers: [],
  viewOptions: ["map", "map:markers", "table"]
});

export const updateUploadedFile = (uploadedFile: UploadedFile) => {
  if (uploadedFile.data.length > 1000) {
    if (state.viewOptions.indexOf("map:clusters") < 0) {
      state.viewOptions.push("map:clusters");
    }
  }
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

export const exportToCsv = () => {
  if (state.tableLogic && state.tableLogic.api) {
    state.tableLogic.api.exportDataAsCsv();
  }
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

export const uploadLayer = (file: File) => {
  const worker = new ShapeParserWorker();
  worker.postMessage(file);
  worker.onmessage = event => {
    event.data.features.forEach((feature: any) => {
      feature.properties.Table_Map_Id = Math.random().toString(36).substring(7);
    });
    state.layers = state.layers.concat({
      id: Math.random().toString(36).substring(7),
      fileName: file.name,
      data: event.data
    });
  }
}

export const removeLayer = (item: { id: string, fileName: string; data: object }) => {
  state.layers = state.layers.filter(_ => _.id !== item.id);
}

export const reset = () => {
  state.uploadedFile = null;
  state.filters = {};
  state.sorting = [];
  state.map = {
    overlayEventJsons: [],
    infoWindowKeys: []
  };
  state.tableLogic = null;
  state.viewOptions = ["map", "map:markers", "table"];
}

export default state;