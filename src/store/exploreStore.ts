import Vue from "vue";
import UploadedFile from "@/entities/UploadedFile";
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
  overlayEventJsons: OverlayJson[],
  tableLogic: TableLogic | null,
  layers: { id: string, fileName: string, data: object | null }[],
  viewOptions: string[],
  saving: {
    file: boolean,
    configFile: boolean,
    geojsonFile: boolean
  }
};

interface Config {
  columnSelections: {
    lat: number;
    lng: number;
  };
  firstRowHeader: boolean;
  filters: { [colId: string]: any };
  sorting: { colId: string; sort: string }[];
  viewOptions: string[];
  overlayEventJsons: OverlayJson[];
  ids: {
    file: string | null;
    geojsonFile: string | null;
  };
}

const state: ExploreStoreI = Vue.observable({
  uploadedFile: null,
  filters: {},
  sorting: [],
  overlayEventJsons: [],
  tableLogic: null,
  layers: [],
  viewOptions: ["map", "map:markers", "table", "table:footer", "table:footer:avg"],
  saving: {
    file: false,
    configFile: false,
    geojsonFile: false
  }
});

export const updateUploadedFile = (uploadedFile: UploadedFile) => {
  if (uploadedFile.data.length > 1000) {
    if (state.viewOptions.indexOf("map:clusters") < 0) {
      state.viewOptions.push("map:clusters");
    }
  }
  state.uploadedFile = uploadedFile;
  state.tableLogic = new TableLogic(uploadedFile);
  saveUploadedFile();
}

export const downloadUserUpload = async (files: {
  file: gapi.client.drive.File;
  configFile: gapi.client.drive.File | undefined;
  geojsonFile: gapi.client.drive.File | undefined;
}, toSaveChanges: boolean) => {
  return new Promise(async (resolve) => {
    if (files.file.id && files.configFile && files.configFile.id) {
      const worker = new ParserWorker();
      worker.postMessage({
        file: await downloadFile(files.file.id),
        type: "buffer",
      });
      worker.onmessage = async (event) => {
        const config: Config = JSON.parse(
          await downloadFile(files.configFile!.id!)
        ) as any;
        const uploadedFile = new UploadedFile({
          toUpload: false,
          toSaveChanges,
          fileName: files.file.name!,
          data: event.data.data,
          columnSelections: config.columnSelections,
          firstRowHeader: config.firstRowHeader,
        });
        if (config.filters) {
          state.filters = config.filters;
        }
        if (config.sorting) {
          state.sorting = config.sorting;
        }
        if (config.viewOptions) {
          state.viewOptions = config.viewOptions;
        }
        if (config.overlayEventJsons) {
          state.overlayEventJsons = config.overlayEventJsons;
        }
        updateUploadedFile(uploadedFile);
        if (files.geojsonFile && files.geojsonFile.id) {
          await downloadFile(files.geojsonFile.id).then((layers) => {
            state.layers = JSON.parse(layers);
            state.layers.forEach(layer => {
              processUploadedLayer(layer);
            });
          });
        }
        worker.terminate();
        resolve(true);
      };
    }
  });
}

export const saveUploadedFile = () => {
  if (driveState.user && state.uploadedFile && state.uploadedFile.toUpload) {
    if (router.currentRoute.name !== "Explore") {
      router.push({ name: "Explore" });
    }
    updateGeojsonFile(() => {
      const data = arrayToCSV(state.uploadedFile!.data.map(_ => _.data));
      state.saving.file = true;
      uploadFile(data, "text/csv", state.uploadedFile!.fileName, undefined, () => {
        state.saving.file = false;
        updateConfigFile((configFile) => {
          router.replace({ name: "Explore", params: { fileId: configFile.id! } });
        });
      });
    });
    state.uploadedFile.toUpload = false;
  } else if (state.uploadedFile) {
    const configFile = driveState.files.find(_ => _.name === `${state.uploadedFile!.fileName}.json`);
    if (configFile) {
      if (router.currentRoute.params.fileId !== configFile.id) {
        router.push({ name: "Explore", params: { fileId: configFile.id! } });
      }
    } else if (router.currentRoute.name !== "Explore") {
      router.push({ name: "Explore" });
    }
  } else if (router.currentRoute.name !== "Explore") {
    router.push({ name: "Explore" });
  }
}

const updateConfigFile = (callback?: (file: gapi.client.drive.File) => void | undefined) => {
  if (driveState.user && state.uploadedFile && state.uploadedFile.toSaveChanges) {
    const files = {
      file: driveState.files.find(_ => _.name === state.uploadedFile!.fileName),
      configFile: driveState.files.find(_ => _.name === `${state.uploadedFile!.fileName}.json`),
      geojsonFile: driveState.files.find(_ => _.name === `${state.uploadedFile!.fileName}.geojson.json`)
    };
    const configObj: Config = {
      columnSelections: state.uploadedFile.columnSelections,
      firstRowHeader: state.uploadedFile.firstRowHeader,
      viewOptions: state.viewOptions,
      sorting: state.sorting,
      filters: state.filters,
      overlayEventJsons: state.overlayEventJsons,
      ids: {
        file: files.file ? files.file.id! : null,
        geojsonFile: files.geojsonFile ? files.geojsonFile.id! : null
      }
    };
    const config = JSON.stringify(configObj);
    state.saving.configFile = true;
    uploadFile(config, "application/json", `${state.uploadedFile!.fileName}.json`, files.configFile ? files.configFile.id : undefined, (file) => {
      if (callback) {
        callback(file);
      }
      state.saving.configFile = false;
    });
  }
}

const updateGeojsonFile = (callback?: (file: gapi.client.drive.File) => void | undefined) => {
  if (driveState.user && state.uploadedFile && state.uploadedFile.toSaveChanges) {
    const config = JSON.stringify(state.layers.filter(_ => _.data !== null));
    const existingConfigFile = driveState.files.find(_ => _.name === `${state.uploadedFile!.fileName}.geojson.json`);
    state.saving.geojsonFile = true;
    uploadFile(config, "application/json", `${state.uploadedFile!.fileName}.geojson.json`, existingConfigFile ? existingConfigFile.id : undefined, (file) => {
      if (callback) {
        callback(file);
      }
      state.saving.geojsonFile = false;
    });
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
  state.overlayEventJsons = overlayEventJsons;
  updateConfigFile();
}

export const updateSorting = (sorting: { colId: string; sort: string }[]) => {
  if (JSON.stringify(state.sorting) !== JSON.stringify(sorting)) {
    state.sorting = sorting;
    updateConfigFile();
  }
}

export const updateFilters = (filters: { [colId: string]: any }) => {
  if (JSON.stringify(state.filters) !== JSON.stringify(filters)) {
    state.filters = filters;
    updateConfigFile();
  }
}

export const updateViewOptions = (viewOptions: string[]) => {
  if (JSON.stringify(state.viewOptions) !== JSON.stringify(viewOptions)) {
    state.viewOptions = viewOptions;
    updateConfigFile();
  }
}

export const exportToCsv = () => {
  if (state.tableLogic && state.tableLogic.api && state.uploadedFile) {
    state.tableLogic.api.exportDataAsCsv({
      columnKeys: state.uploadedFile.data[0].data.map((_, index) => index.toString()),
      skipPinnedBottom: true
    });
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
    updateGeojsonFile();
    processUploadedLayer(newLayer);
    worker.terminate();
  };
}

const processUploadedLayer = (layer: { id: string, fileName: string, data: object | null }) => {
  if (!state.uploadedFile) {
    return;
  }
  createFeature(layer);
  const fkWorker = new PolygonRelationWorker();
  const features = (layer.data as any).features;
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
    if (state.uploadedFile === null) {
      fkWorker.terminate();
      return;
    }
    const polygonIndices: number[] = event.data.polygonIndices;
    const featureIndex = state.uploadedFile.data[0].features.findIndex(
      (_) => _.id === layer.id
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
    messages = messages + 1;
    if (messages === state.uploadedFile.data.length) {
      fkWorker.terminate();
    }
  };
}

export const removeLayer = (item: { id: string, fileName: string; data: object | null }) => {
  if (state.uploadedFile) {
    state.uploadedFile.data.forEach(d => {
      d.features = d.features.filter(_ => _.id !== item.id);
    });
  }
  state.layers = state.layers.filter(_ => _.id !== item.id);
  updateGeojsonFile();
}

export const reset = () => {
  state.uploadedFile = null;
  state.filters = {};
  state.sorting = [];
  state.overlayEventJsons = [];
  state.tableLogic = null;
  state.layers = [];
  state.viewOptions = ["map", "map:markers", "table", "table:footer", "table:footer:avg"];
}

export default state;