export default class ExampleAnalysis {
  public id!: number;
  public title!: string;
  public description!: string;
  public img!: string;
  public createdOn!: Date;

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
    }
    const minutes = this.createdOn
      .getMinutes()
      .toString()
      .padStart(2, "0");
    return `${month}-${day}-${year} ${hours
      .toString()
      .padStart(2, "0")}:${minutes} ${amPm}`;
  }

  constructor(obj: ExampleAnalysis) {
    Object.assign(this, obj)
  }
}