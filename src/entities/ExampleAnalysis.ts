export default class ExampleAnalysis {
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

  constructor(obj: ExampleAnalysis) {
    Object.assign(this, obj)
  }
}