import { ColDef, ColGroupDef } from 'ag-grid-community'
import UploadedFile from '@/entities/UploadedFile'

export const defaultColDef: ColDef = {
  sortable: true,
  filter: true,
  resizable: true
}

export default class TableLogic {

  public columnDefs: (ColDef | ColGroupDef)[] = []

  constructor(uploadedFile: UploadedFile) {
    const generatedCols: (ColDef | ColGroupDef)[] = uploadedFile.data[0].data.map((_, index) => {
      if (uploadedFile.firstRowHeader) {
        return {
          headerName: uploadedFile.data[0].data[index],
          field: index.toString()
        }
      } else {
        return {
          headerName: `Column ${(index + 1).toString()}`,
          field: index.toString()
        }
      }
    })
    this.columnDefs = generatedCols
  }
}