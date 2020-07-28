interface ExampleAnalysisI {
  id: number
  title: string
  description: string
  preview: string
  url: string
  createdOn: Date
  config: {
    data: () => Promise<{ default: any[][]}>,
    columnSelections: { lat: number, lng: number },
    firstRowHeader: boolean
  }
}

export default class ExampleAnalysis implements ExampleAnalysisI {
  public id!: number;
  public title!: string;
  public description!: string;
  public preview!: string;
  public url!: string;
  public createdOn!: Date;
  public config!: {
    data: () => Promise<{ default: any[][]}>,
    columnSelections: { lat: number, lng: number },
    firstRowHeader: boolean
  };

  constructor(obj: ExampleAnalysisI) {
    Object.assign(this, obj)
  }
}