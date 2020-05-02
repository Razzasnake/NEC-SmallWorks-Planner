interface ExampleAnalysisI {
  id: number
  title: string
  description: string
  preview: string
  url: string
  createdOn: Date
  config: {
    data: any[][],
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
    data: any[][],
    columnSelections: { lat: number, lng: number },
    firstRowHeader: boolean
  };

  public get formattedCreatedOn(): string {
    const year = this.createdOn.getFullYear().toString();
    const month = this.createdOn
      .getMonth()
      .toString()
      .padStart(2, "0");
    const day = this.createdOn
      .getDate()
      .toString()
      .padStart(2, "0");
    let hours = this.createdOn.getHours();
    let amPm = "AM";
    if (hours > 12) {
      hours = hours - 12;
      amPm = "PM";
    } else if (hours === 0) {
      hours = 12
    }
    const minutes = this.createdOn
      .getMinutes()
      .toString()
      .padStart(2, "0");
    return `${month}-${day}-${year} ${hours
      .toString()
      .padStart(2, "0")}:${minutes} ${amPm}`;
  }

  constructor(obj: ExampleAnalysisI) {
    Object.assign(this, obj)
  }
}