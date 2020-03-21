import moment from 'moment'
import { ColDef, ColGroupDef, SideBarDef, MenuItemDef } from 'ag-grid-community'
import UploadedFile from '@/entities/UploadedFile'

export default class TableLogic {
  public statusBar = {
    statusPanels: [
      {
        statusPanel: 'agAggregationComponent',
        statusPanelParams: {
          aggFuncs: ['count', 'sum', 'min', 'max', 'avg']
        }
      }
    ]
  }

  public defaultColDef: ColDef = {
    sortable: true,
    filter: true,
    resizable: true,
    enableCellChangeFlash: true,
    menuTabs: ['filterMenuTab', 'columnsMenuTab', 'generalMenuTab']
  }

  public defaultSideBar: SideBarDef = {
    toolPanels: [
      {
        id: 'filters',
        labelDefault: 'Filters',
        labelKey: 'filters',
        iconKey: 'filter',
        toolPanel: 'agFiltersToolPanel',
      },
      {
        id: 'columns',
        labelDefault: 'Columns',
        labelKey: 'columns',
        iconKey: 'columns',
        toolPanel: 'agColumnsToolPanel',
      }
    ],
    position: 'right',
    defaultToolPanel: 'filters'
  }

  public columnDefs: (ColDef | ColGroupDef)[] = []

  constructor(uploadedFile: UploadedFile) {
    this.columnDefs = uploadedFile.data[0].data.map((_, index) => {
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
  }

  public getContextMenuItems(): (MenuItemDef | string)[] {
    return [
      'copy',
      'copyWithHeaders',
      'export'
    ]
  }

  protected dateFormatter(params: { value: any }): string {
    const value = parseFloat(params.value)
    return moment(value * 1000).format('MM/DD/YYYY')
  }

  protected currencyFormatter(params: { value: any }): string {
    const value = parseFloat(params.value)
    return value.toString()
  }

  protected percentFormatter(params: { value: any }): string {
    const value = parseFloat(params.value)
    if (value > 1) {
      return (value / 100).toString()
    }
    return value.toString()
  }

  protected dateTimeFormatter(params: { value: any }): string {
    const value = parseFloat(params.value)
    return moment(value * 1000).format('MM/DD/YYYY')
  }
}