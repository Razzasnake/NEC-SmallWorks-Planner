import { ColDef, ColGroupDef } from "ag-grid-community"
import UploadedFile from "@/entities/UploadedFile"

export const defaultColDef: ColDef = {
  sortable: true,
  filter: true,
  resizable: true
}

export default class TableLogic {

  public columnDefs: (ColDef | ColGroupDef)[] = []

  private computeColumnTypes(uploadedFile: UploadedFile) {
    const columnTypes: { number: number, string: number }[] = []
    for (let i = 0; i < uploadedFile.data[0].data.length; i++) {
      columnTypes.push({ number: 0, string: 0 })
    }
    uploadedFile.data.slice(uploadedFile.firstRowHeader ? 1 : 0).forEach(row => {
      row.data.forEach((col, colIndex) => {
        if (isNaN(col)) {
          columnTypes[colIndex].string += 1
        } else {
          columnTypes[colIndex].number += 1
        }
      })
    })
    return columnTypes.map(meta => {
      return (meta.number / (meta.number + meta.string)) > 0.95 ? "number" : "text"
    })
  }

  constructor(uploadedFile: UploadedFile) {
    const columnTypes = this.computeColumnTypes(uploadedFile)
    const generatedCols: (ColDef | ColGroupDef)[] = uploadedFile.data[0].data.map((_, index) => {
      if (uploadedFile.firstRowHeader) {
        return {
          headerName: uploadedFile.data[0].data[index],
          field: index.toString(),
          filter: columnTypes[index]
        }
      } else {
        return {
          headerName: `Column ${(index + 1).toString()}`,
          field: index.toString(),
          filter: columnTypes[index]
        }
      }
    })
    this.columnDefs = generatedCols
  }
}