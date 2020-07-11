const ctx: Worker = self as any;

const geojsonParser = (bstr: string | ArrayBuffer) => {
  return JSON.parse(bstr.toString())
}

ctx.onmessage = (event: { data: File }) => {
  const reader = new FileReader();
  reader.onloadend = e => {
    if (e.target) {
      const bstr = e.target.result;
      if (bstr) {
        if (event.data.name.endsWith('.json') || event.data.name.endsWith('.geojson')) {
          ctx.postMessage(geojsonParser(bstr));
        } else {
          // Expand on shape file type support here.
          ctx.postMessage({});
        }
      } else {
        ctx.postMessage({});
      }
    } else {
      ctx.postMessage({});
    }
  };
  reader.readAsBinaryString(event.data);
};