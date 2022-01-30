class Row {
  public index: number;
  public data: any[];
  public columnSelections: { lat: number, lng: number } | null = null;
  public features: { name: string, id: string, features: google.maps.Data.Feature[] | null }[] = [];

  public get lat() {
    return parseFloat(this.data[this.columnSelections!.lat]);
  }

  public get lng() {
    return parseFloat(this.data[this.columnSelections!.lng]);
  }

  public get id() {
    return this.index.toString();
  }

  constructor(index: number, row: any[], columnSelections: { lat: number, lng: number }) {
    this.index = index;
    this.data = row;
    this.columnSelections = columnSelections;
  }
}

export default class UploadedFile {
  public toUpload: boolean;
  public toSaveChanges: boolean;
  public fileName: string;
  public readonly data: Row[];
  public columnSelections: { lat: number, lng: number };
  public firstRowHeader: boolean;

  constructor(obj: { toUpload: boolean, toSaveChanges: boolean, fileName: string, data: any[][], columnSelections: { lat: number, lng: number }, firstRowHeader: boolean }) {
    this.toUpload = obj.toUpload;
    this.toSaveChanges = obj.toSaveChanges;
    this.fileName = obj.fileName;
    this.data = obj.data.map((_, index) => Object.freeze(new Row(index, _, obj.columnSelections)));
    this.columnSelections = obj.columnSelections;
    this.firstRowHeader = obj.firstRowHeader;
  }
}

export { Row }