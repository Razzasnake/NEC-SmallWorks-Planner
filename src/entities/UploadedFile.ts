export class Row {
  public index: number;
  public data: Record<string, any>; // Changed to an object
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

  constructor(index: number, row: Record<string, any>, columnSelections: { lat: number, lng: number }) { // Updated row type
    if (!columnSelections) {
        throw new Error('columnSelections is undefined');
    }
    this.index = index;
    this.data = row; // No need to convert
    this.columnSelections = columnSelections;
  }
}


export interface ColumnSelections {
  lat: number;
  lng: number;
  priority?: number;
}

export default class UploadedFile {
  public toUpload: boolean;
  public toSaveChanges: boolean;
  public fileName: string;
  public readonly data: Row[];
  public columnSelections: { lat: number, lng: number };
  public firstRowHeader: boolean;
  public headers: string[];
  public priorityIndex: number | null = null;
  public startDateIndex: number | null = null;

  constructor(jsonData: any) {
    this.toUpload = jsonData.toUpload || false;
    this.toSaveChanges = jsonData.toSaveChanges || false;
    this.fileName = jsonData.fileName || "";
    this.columnSelections = jsonData.columnSelections || { lat: 0, lng: 0 };
    this.firstRowHeader = jsonData.firstRowHeader || false;
    this.headers = jsonData.data[0];
    this.priorityIndex = jsonData.data[0].indexOf('Priority:');
    this.startDateIndex = jsonData.data[0].indexOf('Start Date:');

    const headers = jsonData.data[0]; // Get headers from the first row
    const rowsData = jsonData.data.slice(1).map((row: any) => {
        const rowArray: any[] = [];
        row.forEach((cell: any, index: number) => {
             rowArray[index] = cell;
        });
        return rowArray;
    });
    this.data = rowsData
      .filter((row: Record<string, any>) => row !== undefined) // add this line
      .map((row: Record<string, any>, index: number) => {
        return new Row(index, row, this.columnSelections)
      });
  }



}
