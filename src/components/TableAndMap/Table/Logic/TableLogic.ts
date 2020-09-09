import { ColDef, ColGroupDef, GridApi, ICellRendererParams } from "@ag-grid-community/core"
import UploadedFile, { Row } from "@/entities/UploadedFile"
import AgPreview from "./AgPreview.vue"
import { max } from "@/logic/Math";

export const defaultColDef: ColDef = {
  sortable: true,
  filter: true,
  resizable: true,
  cellRenderer: (params: ICellRendererParams) => {
    const urlExpression = /(https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|www\.[a-zA-Z0-9][a-zA-Z0-9-]+[a-zA-Z0-9]\.[^\s]{2,}|https?:\/\/(?:www\.|(?!www))[a-zA-Z0-9]+\.[^\s]{2,}|www\.[a-zA-Z0-9]+\.[^\s]{2,})/gi;
    const urlRegex = new RegExp(urlExpression);
    if ((params.value || "").toString().match(urlRegex)) {
      return `<a href="${params.value}" target="_blank">${params.value}</a>`;
    } else {
      return params.value;
    }
  }
}

export default class TableLogic {

  public columnDefs: (ColDef | ColGroupDef)[] = []
  public api: GridApi | null = null;

  public setGridApi(api: GridApi) {
    /* This is so we can call the export function from the store. */
    this.api = api;
  }

  private computeColumnTypes(uploadedFile: UploadedFile) {
    const columnTypes: { number: number, string: number }[] = []
    const maxCols = max(uploadedFile.data.map(_ => _.data.length));
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
      width: 92,
      suppressMenu: true,
      sortable: false,
      cellRenderer: undefined,
      cellRendererFramework: AgPreview
    }
    this.columnDefs = [previewCol].concat(generatedCols)
  }
}