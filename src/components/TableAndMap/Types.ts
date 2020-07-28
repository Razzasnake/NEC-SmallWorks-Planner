import { OverlayJson } from './GoogleMap/Logic/Utils'

interface TableAndMapMap {
  overlayEventJsons: OverlayJson[],
  infoWindowKeys: { label: string, prop: string }[]
}

interface TableAndMapTable {
  filters: { [colId: string]: any },
  columnSorting: { colId: string, sort: string }[]
}

export { TableAndMapMap, TableAndMapTable }