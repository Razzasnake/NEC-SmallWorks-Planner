import ExampleAnalysis from "@/entities/ExampleAnalysis";
import axios from 'axios';
import ParserWorker from "worker-loader!@/components/UploadWorkflow/Upload/Parser";

const input = [
  {
    index: 0,
    title: 'Covid-19 Confirmed Cases US',
    description: 'Daily time series data for confirmed Covid-19 cases in the United States.',
    githubFileName: 'time_series_covid19_confirmed_US.csv'
  },
  {
    index: 1,
    title: 'Covid-19 Confirmed Deaths US',
    description: 'Daily time series data for confirmed Covid-19 deaths in the United States.',
    githubFileName: 'time_series_covid19_deaths_US.csv'
  }
]

const generate = (x: { index: number, title: string, description: string, githubFileName: string }) => {
  return new ExampleAnalysis({
    id: x.index,
    title: x.title,
    description: x.description,
    preview: require(`@/assets/examples/covid19/preview-${x.index}.jpg`),
    url: 'https://github.com/CSSEGISandData/COVID-19/blob/master/csse_covid_19_data/csse_covid_19_time_series/' + x.githubFileName,
    createdOn: new Date(),
    config: {
      data: async () => {
        const url = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/' + x.githubFileName;
        return new Promise((resolve) => {
          const worker = new ParserWorker();
          axios.get(url).then(response => {
            worker.postMessage({ file: response.data, type: 'buffer', options: { header: 1, raw: false } });
            worker.onmessage = event => {
              const cleanArr = event.data.data.map((x: any[]) => {
                return x.map(y => {
                  if (!isNaN(y)) {
                    return parseFloat(y);
                  }
                  return y;
                });
              });
              resolve({ default: cleanArr });
            }
          });
        });
      },
      columnSelections: { lat: 8, lng: 9 },
      firstRowHeader: true
    }
  })
}

export default {
  getAllExamples(): Promise<ExampleAnalysis[]> {
    return new Promise((resolve, _) => {
      resolve(input.map(generate))
    })
  }
}