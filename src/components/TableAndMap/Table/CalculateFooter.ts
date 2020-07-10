import { Row } from "@/entities/UploadedFile";

const ctx: Worker = self as any;

const calculateFooter = (columnIds: string[], rowData: Row[]) => {
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
};

ctx.onmessage = (event) => {
  const result = calculateFooter(event.data.columnIds, event.data.rowData);
  ctx.postMessage(result);
};