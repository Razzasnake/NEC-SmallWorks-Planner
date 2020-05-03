import { ColDef, ColGroupDef } from 'ag-grid-community'
import UploadedFile from '@/entities/UploadedFile'
import AgGridCheckbox from './AgGridCheckbox.vue'

export default class TableLogic {

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true
  }

  public columnDefs: (ColDef | ColGroupDef)[] = []

  constructor(uploadedFile: UploadedFile) {
    const isSelectedCol: (ColDef | ColGroupDef)[] = [{
      headerName: '',
      field: 'isSelected',
      pinned: 'left',
      width: 43,
      cellRendererFramework: AgGridCheckbox
    }]
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
    this.columnDefs = isSelectedCol.concat(generatedCols)
  }
}