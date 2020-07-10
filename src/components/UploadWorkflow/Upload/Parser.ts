import { read, utils } from "xlsx";

const ctx: Worker = self as any;

const convert = (file: string | ArrayBuffer | null, type: "binary" | "buffer", options = { header: 1 }): { error: boolean, data: unknown[] } => {
  try {
    const workbook = read(file, { type });
    const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]];
    return {
      error: false,
      data: utils.sheet_to_json(firstWorksheet, options)
    };
  } catch (e) {
    return {
      error: true,
      data: []
    }
  }
};

ctx.onmessage = (event) => {
  const result = convert(event.data.file, event.data.type, event.data.options);
  ctx.postMessage(result);
};