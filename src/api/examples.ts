import ExampleAnalysis from "@/entities/ExampleAnalysis";
import axios from 'axios';
import { read, utils } from "xlsx";

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
    description: 'Daily time series data for confirmed Covid-19 cases in the United States.',
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
        const url = 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/' + x.githubFileName
        return axios.get(url).then(response => {
          const workbook = read(response.data, { type: 'buffer' });
          const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]];
          return { default: utils.sheet_to_json(firstWorksheet, { header: 1, raw: false }) };
        })
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