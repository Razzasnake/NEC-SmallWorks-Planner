import axios from 'axios';
import ParserWorker from "worker-loader!@/components/UploadWorkflow/Upload/Parser.worker";
import ExampleTeaserI from "@/entities/storyblok/ExampleTeaser";
import UpladedFile from "@/entities/UploadedFile";


export default {
  getExample(teaser: ExampleTeaserI): Promise<UpladedFile> {
    return new Promise((resolve) => {
      const worker = new ParserWorker();
      axios.get(teaser.feature.url).then(response => {
        worker.postMessage({ file: response.data, type: 'buffer' });
        worker.onmessage = event => {
          resolve(new UpladedFile({
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