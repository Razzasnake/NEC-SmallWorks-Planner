import Vue from "vue";
import UploadedFile from "@/entities/UploadedFile";
import { TableAndMapMap } from "@/components/TableAndMap/Types";
import TableLogic from "@/components/TableAndMap/Table/Logic/TableLogic";
import { OverlayJson } from "@/components/TableAndMap/GoogleMap/Logic/Utils";
import ShapeParserWorker from "worker-loader!./WebWorkers/ShapeParser.worker";
import PolygonRelationWorker from "worker-loader!./WebWorkers/PolygonRelation.worker";
import driveState, { uploadFile, downloadFile } from "./driveStore";
import ParserWorker from "worker-loader!@/components/UploadWorkflow/Upload/Parser.worker";
import router from "@/router";

interface ExploreStoreI {
  uploadedFile: UploadedFile | null,
  filters: { [colId: string]: any },
  sorting: { colId: string; sort: string }[],
  map: TableAndMapMap,
  tableLogic: TableLogic | null,
  layers: { id: string, fileName: string, data: object | null }[],
  viewOptions: string[]
};

interface Config {
  columnSelections: {
    lat: number;
    lng: number;
  };
  firstRowHeader: boolean;
}

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
  router.push({ name: "Explore" });
  saveUploadedFile();
}

export const downloadUserUpload = async (files: {
  file: gapi.client.drive.File;
  configFile: gapi.client.drive.File;
}) => {
  if (files.file.id && files.configFile.id) {
    const worker = new ParserWorker();
    worker.postMessage({
      file: await downloadFile(files.file.id),
      type: "buffer",
    });
    const config: Config = JSON.parse(
      await downloadFile(files.configFile.id!)
    ) as any;
    worker.onmessage = async (event) => {
      const uploadedFile = new UploadedFile({
        toUpload: false,
        fileName: files.file.name!,
        data: event.data.data,
        columnSelections: config.columnSelections,
        firstRowHeader: config.firstRowHeader,
      });
      updateUploadedFile(uploadedFile);
      worker.terminate();
    };
  }
}

export const saveUploadedFile = () => {
  if (driveState.user && state.uploadedFile && state.uploadedFile.toUpload) {
    const config = JSON.stringify({
      columnSelections: state.uploadedFile.columnSelections,
      firstRowHeader: state.uploadedFile.firstRowHeader
    });
    const data = arrayToCSV(state.uploadedFile.data.map(_ => _.data));
    uploadFile(data, "text/csv", state.uploadedFile.fileName, (fileId) => {
      router.push({ name: "Explore", params: { fileId } });
    });
    uploadFile(config, "application/json", `${state.uploadedFile.fileName}.json`);
    state.uploadedFile.toUpload = false;
  } else if (state.uploadedFile) {
    const file = driveState.files.find(_ => _.name === state.uploadedFile!.fileName);
    if (file) {
      if (router.currentRoute.params.fileId !== file.id) {
        router.push({ name: "Explore", params: { fileId: file.id! } });
      }
    } else {
      router.push({ name: "Explore" });
    }
  } else {
    router.push({ name: "Explore" });
  }
}

const arrayToCSV = (dataArr: any[][]) => {
  const escapeCol = (col: any) => {
    if (isNaN(col)) {
      if (!col) {
        col = '';
      } else {
        col = String(col);
        if (col.length > 0) {
          col = col.split('"').join('"' + '"');
          col = '"' + col + '"';
        }
      }
    }
    return col;
  };
  const arrayToRow = (arr: any[]): any => {
    const arr2 = arr.slice(0);
    const ii = arr2.length;
    for (let i = 0; i < ii; i++) {
      arr2[i] = escapeCol(arr2[i]);
    }
    return arr2.join(",");
  };
  const arr2 = dataArr.slice(0);
  const ii = arr2.length;
  for (let i = 0; i < ii; i++) {
    arr2[i] = arrayToRow(arr2[i]);
  }
  return arr2.join("\r\n");
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

export const createFeature = (layer: { id: string, fileName: string, data: object | null }) => {
  if (state.uploadedFile) {
    state.uploadedFile.data.forEach(d => {
      d.features.push({
        id: layer.id,
        name: layer.fileName,
        features: null
      })
    })
  }
}

export const updateFeature = (fk: { featureIndex: number, index: number, features: google.maps.Data.Feature[] }) => {
  if (state.uploadedFile) {
    state.uploadedFile.data[fk.index].features[fk.featureIndex] = {
      id: state.uploadedFile.data[fk.index].features[fk.featureIndex].id,
      name: state.uploadedFile.data[fk.index].features[fk.featureIndex].name,
      features: fk.features
    }
  }
}

export const uploadLayer = (file: File) => {
  const newLayer = {
    id: Math.random().toString(36).substring(7),
    fileName: file.name,
    data: null,
  };
  state.layers = state.layers.concat(newLayer);
  const worker = new ShapeParserWorker();
  worker.postMessage(file);
  worker.onmessage = (event) => {
    const features = event.data.features;
    if (features === undefined) {
      return;
    }
    features.forEach((feature: any) => {
      feature.properties.Table_Map_Id = Math.random()
        .toString(36)
        .substring(7);
    });
    newLayer.data = event.data;
    state.layers = state.layers.filter(_ => _.id !== newLayer.id).concat(newLayer);
    if (state.uploadedFile) {
      createFeature(newLayer);
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
        if (state.uploadedFile === null) {
          fkWorker.terminate();
          return;
        }
        const polygonIndices: number[] = event.data.polygonIndices;
        const featureIndex = state.uploadedFile.data[0].features.findIndex(
          (_) => _.id === newLayer.id
        );
        if (featureIndex < 0) {
          fkWorker.terminate();
          return;
        }
        updateFeature({
          featureIndex,
          index: event.data.index,
          features: polygonIndices.map((index) => features[index]),
        });
        if (messages === state.uploadedFile.data.length) {
          fkWorker.terminate();
        }
      };
    }
    worker.terminate();
  };
}

export const removeLayer = (item: { id: string, fileName: string; data: object | null }) => {
  if (state.uploadedFile) {
    state.uploadedFile.data.forEach(d => {
      d.features = d.features.filter(_ => _.id !== item.id);
    });
  }
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
  state.layers = [];
  state.viewOptions = ["map", "map:markers", "table"];
}

export default state;