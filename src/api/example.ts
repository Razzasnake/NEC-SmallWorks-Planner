import axios from 'axios';
import ParserWorker from "worker-loader!@/components/UploadWorkflow/Upload/Parser";
import TeaserI from "@/entities/storyblok/Teaser";
import UpladedFile from "@/entities/UploadedFile";


export default {
  getExample(teaser: TeaserI): Promise<UpladedFile> {
    return new Promise((resolve) => {
      const worker = new ParserWorker();
      axios.get(teaser.feature.url).then(response => {
        worker.postMessage({ file: response.data, type: 'buffer' });
        worker.onmessage = event => {
          resolve(new UpladedFile({
            data: event.data.data,
            columnSelections: { lat: 8, lng: 9 },
            firstRowHeader: true
          }));
        }
      });
    });
  }
}