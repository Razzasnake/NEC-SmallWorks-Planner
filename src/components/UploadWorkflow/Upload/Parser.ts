import { read, utils } from "xlsx";

const ctx: Worker = self as any;

const convert = (file: string | ArrayBuffer | null, type: "binary" | "buffer"): unknown[] => {
  const workbook = read(file, { type });
  const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]];
  return utils.sheet_to_json(firstWorksheet, { header: 1 });
};

ctx.onmessage = (event) => {
  const result = convert(event.data.file, event.data.type);
  ctx.postMessage(result);
  ctx.terminate();
};