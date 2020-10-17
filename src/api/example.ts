import axios from 'axios';
import ParserWorker from "worker-loader!@/components/UploadWorkflow/Upload/Parser.worker";
import ExampleTeaserI from "@/entities/ExampleTeaser";
import UploadedFile from "@/entities/UploadedFile";


export default {
  getExample(teaser: ExampleTeaserI): Promise<UploadedFile> {
    return new Promise((resolve) => {
      const worker = new ParserWorker();
      axios.get(teaser.github.url).then(response => {
        worker.postMessage({ file: response.data, type: 'buffer' });
        worker.onmessage = event => {
          resolve(new UploadedFile({
            toUpload: false,
            toSaveChanges: false,
            fileName: teaser.title,
            data: event.data.data,
            columnSelections: { lat: teaser.lat, lng: teaser.lng },
            firstRowHeader: teaser.firstRowHeader
          }));
          worker.terminate();
        }
      });
    });
  }
}