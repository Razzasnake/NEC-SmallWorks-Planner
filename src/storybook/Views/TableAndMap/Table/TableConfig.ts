import UploadedFile from '@/entities/UploadedFile'

export default class TableConfig {

  public defaultColDef = {
    sortable: true,
    filter: true,
    resizable: true
  }

  public columnDefs: { headerName: string, field: string }[]

  constructor(uploadedFile: UploadedFile) {
    this.columnDefs = uploadedFile.data[0].map((_, index) => {
      if (uploadedFile.firstRowHeader) {
        return {
          headerName: uploadedFile.data[0][index],
          field: index.toString()
        }
      } else {
        return {
          headerName: `Column ${(index + 1).toString()}`,
          field: index.toString()
        }
      }
    })
  }
}