class Row {
  public id!: string;
  public index!: number;
  public data!: any[];
  public tableData!: { [key: string]: any };
  public lat: number | null = null;
  public lng: number | null = null;
  [key: string]: any;

  constructor(index: number, row: any[], columnSelections: { lat: number, lng: number }) {
    this.index = index;
    this.id = index.toString();
    this.data = row;
    this.lat = parseFloat(row[columnSelections.lat]);
    this.lng = parseFloat(row[columnSelections.lng]);
    row.forEach((col, index) => {
      this[index.toString()] = col;
    })
  }
}

export default class UploadedFile {
  public data: Row[];
  public columnSelections: { lat: number, lng: number };
  public firstRowHeader: boolean;

  public get rawData(): any[][] {
    return this.data.map(row => row.data)
  }

  constructor(obj: { data: any[][], columnSelections: { lat: number, lng: number }, firstRowHeader: boolean }) {
    this.data = obj.data.map((_, index) => new Row(index, _, obj.columnSelections));
    this.columnSelections = obj.columnSelections;
    this.firstRowHeader = obj.firstRowHeader;
  }
}

export { Row }