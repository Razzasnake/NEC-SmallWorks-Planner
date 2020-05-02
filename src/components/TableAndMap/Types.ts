import { OverlayJson } from './GoogleMap/Utils'

interface TableAndMapMap {
  overlayEventJsons: OverlayJson[],
  infoWindowKeys: { label: string, prop: string }[],
  allowDraw: boolean
}

interface TableAndMapTable {
  filters: { [colId: string]: any },
  columnSorting: { colId: string, sort: string }[]
}

export { TableAndMapMap, TableAndMapTable }