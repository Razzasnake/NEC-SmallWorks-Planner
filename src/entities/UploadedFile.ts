class Row {
  public id: string;
  public index: number;
  public data: any[];
  public lat: number | null = null;
  public lng: number | null = null;
  public features: { name: string, id: string, features: google.maps.Data.Feature[] | null }[] = [];
  [key: string]: any;

  public get webWorkerSafeState() {
    const data = Object.assign({}, this);
    data.features = [];
    return data;
  }

  constructor(index: number, row: any[], columnSelections: { lat: number, lng: number }) {
    this.id = index.toString();
    this.index = index;
    this.data = row;
    this.lat = parseFloat(row[columnSelections.lat]);
    this.lng = parseFloat(row[columnSelections.lng]);
    row.forEach((col, index) => {
      this[index.toString()] = col;
    });
  }
}

export default class UploadedFile {
  public toUpload: boolean;
  public toSaveChanges: boolean;
  public fileName: string;
  public data: Row[];
  public columnSelections: { lat: number, lng: number };
  public firstRowHeader: boolean;

  constructor(obj: { toUpload: boolean, toSaveChanges: boolean, fileName: string, data: any[][], columnSelections: { lat: number, lng: number }, firstRowHeader: boolean }) {
    this.toUpload = obj.toUpload;
    this.toSaveChanges = obj.toSaveChanges;
    this.fileName = obj.fileName;
    this.data = obj.data.map((_, index) => new Row(index, _, obj.columnSelections));
    this.columnSelections = obj.columnSelections;
    this.firstRowHeader = obj.firstRowHeader;
  }
}

export { Row }