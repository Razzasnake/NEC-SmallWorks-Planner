import { ColDef, ColGroupDef } from "ag-grid-community"
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

  public calculateFooter(columnIds: string[], rowData: Row[]) {
    return Vue.prototype.$worker.run((columnIds: string[], rowData: Row[]) => {
      return columnIds.reduce((acc: { [key: string]: { [key: string]: string } }, key) => {
        const vals: number[] = rowData.map(row => parseFloat(row[key])).filter(_ => _)
        const total: number = vals.reduce((agg, val) => agg += val, 0)
        const roundTo = Math.max(...vals.map(val => {
          const strVal = (val || "").toString();
          if (strVal.includes(".")) {
            return strVal.split(".")[1].length
          }
          return 0
        }))
        acc.min[key] = Math.min(...vals).toFixed(roundTo > 0 ? roundTo : 0)
        acc.max[key] = Math.max(...vals).toFixed(roundTo > 0 ? roundTo : 0)
        acc.total[key] = total.toFixed(roundTo > 0 ? roundTo : 0)
        acc.avg[key] = (total / vals.length).toFixed(roundTo > 0 ? roundTo : 0)
        return acc
      }, { min: {}, max: {}, total: {}, avg: {} })
    }, [columnIds, rowData])
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