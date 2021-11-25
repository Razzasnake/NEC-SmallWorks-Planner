import { read, utils } from "xlsx";

const ctx: Worker = self as any;

const convert = (file: string | ArrayBuffer | null, type: "binary" | "string"): { error: boolean, data: unknown[] } => {
  try {
    try {
      const jsonParse: {[key: string]: any}[] = JSON.parse(file as string);
      const replacer = (key: string, value: any) => value === null ? '' : value;
      const header = Object.keys(jsonParse[0]);
      file = [
        header.join(','),
        ...jsonParse.map(row => header.map(fieldName => JSON.stringify(row[fieldName], replacer)).join(','))
      ].join('\r\n');
    } catch {}
    const workbook = read(file, { type });
    const firstWorksheet = workbook.Sheets[workbook.SheetNames[0]];
    const data: any[][] = utils.sheet_to_json(firstWorksheet, { header: 1, raw: false });
    const cleanArr = data.map(x => {
      return x.map(y => {
        if (!isNaN(y)) {
          return parseFloat(y);
        }
        return y;
      });
    });
    return { error: false, data: cleanArr };
  } catch (e) {
    console.log(e);
    return {
      error: true,
      data: []
    }
  }
};

ctx.onmessage = (event) => {
  const result = convert(event.data.file, event.data.type);
  ctx.postMessage(result);
};