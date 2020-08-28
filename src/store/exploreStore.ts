import Vue from "vue";
import UploadedFile from "@/entities/UploadedFile";
import { TableAndMapMap } from "@/components/TableAndMap/Types";
import TableLogic from "@/components/TableAndMap/Table/Logic/TableLogic";
import { OverlayJson } from "@/components/TableAndMap/GoogleMap/Logic/Utils";
import ShapeParserWorker from "worker-loader!@/components/TableAndMap/GoogleMap/Logic/WebWorkers/ShapeParser.worker";
import PolygonRelationWorker from "worker-loader!@/components/TableAndMap/GoogleMap/Logic/WebWorkers/PolygonRelation.worker";

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
  worker.onmessage = (event) => {
    const features = event.data.features;
    features.forEach((feature: any) => {
      feature.properties.Table_Map_Id = Math.random()
        .toString(36)
        .substring(7);
    });
    state.layers = state.layers.concat({
      id: Math.random().toString(36).substring(7),
      fileName: file.name,
      data: event.data,
    });
    if (state.uploadedFile) {
      createFeature(file.name);
      const featureIndex = state.uploadedFile.data[0].features.findIndex(
        (_) => _.name === file.name
      );
      const fkWorker = new PolygonRelationWorker();
      fkWorker.postMessage({
        markers: state.uploadedFile.data.map((_) => {
          if (_.lng && _.lat) {
            return [_.lng, _.lat];
          } else {
            return [null, null];
          }
        }),
        features,
      });
      let messages: number = 0;
      fkWorker.onmessage = (event) => {
        messages = messages + 1;
        const polygonIndices: number[] = event.data.polygonIndices;
        updateFeature({
          featureIndex,
          index: event.data.index,
          features: polygonIndices.map((index) => features[index]),
        });
        if (messages === state.uploadedFile!.data.length) {
          fkWorker.terminate();
        }
      };
    }
    worker.terminate();
  };
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