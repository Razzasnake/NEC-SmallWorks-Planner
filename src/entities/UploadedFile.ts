export default class UploadedFile {
  public data: any[][]
  public columnSelections: { lat: number, lng: number }
  public firstRowHeader: boolean

  constructor(obj: UploadedFile) {
    this.data = obj.data
    this.columnSelections = obj.columnSelections
    this.firstRowHeader = obj.firstRowHeader
  }
}