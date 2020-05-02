class Row {
  public id!: string;
  public index!: number;
  public data!: any[];
  public tableData!: { [key: string]: any };
  public isSelected: boolean = false;
  public lat: number | null = null;
  public lng: number | null = null;
  [key: string]: any;

  constructor(index: number, row: any[], columnSelections: { lat: number, lng: number }) {
    this.index = index;
    this.id = index.toString();
    this.data = row;
    this.isSelected = false;
    if (typeof row[columnSelections.lat] === 'number') {
      this.lat = row[columnSelections.lat];
    }
    if (typeof row[columnSelections.lng] === 'number') {
      this.lng = row[columnSelections.lng];
    }
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