import { ColDef, ColGroupDef } from "@ag-grid-community/core"
import UploadedFile, { Row } from "@/entities/UploadedFile"
import AgPreview from './AgPreview.vue'
import Vue from 'vue'

export const defaultColDef: ColDef = {
  sortable: true,
  filter: true,
  resizable: true
}

export default class TableLogic {

  public columnDefs: (ColDef | ColGroupDef)[] = []

  private computeColumnTypes(uploadedFile: UploadedFile) {
    const columnTypes: { number: number, string: number }[] = []
    const maxCols = Math.max(...uploadedFile.data.map(_ => _.data.length));
    for (let i = 0; i < maxCols; i++) {
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
    const previewCol: ColDef = {
      headerName: '',
      field: 'preview',
      pinned: 'left',
      width: 40,
      suppressMenu: true,
      suppressSorting: true,
      cellRendererFramework: AgPreview
    }
    this.columnDefs = [previewCol].concat(generatedCols)
  }
}