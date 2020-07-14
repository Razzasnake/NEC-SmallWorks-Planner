import shp from 'shpjs';
const ctx: Worker = self as any;

ctx.onmessage = (event: { data: File }) => {
  const reader = new FileReader();
  reader.onloadend = e => {
    if (e.target) {
      const bstr = e.target.result;
      if (bstr) {
        if (event.data.name.endsWith('.json') || event.data.name.endsWith('.geojson')) {
          ctx.postMessage(JSON.parse(new TextDecoder().decode(bstr as ArrayBuffer)));
        } else if (event.data.name.endsWith('.zip')) {
          shp(bstr).then((geojson: object) => {
            ctx.postMessage(geojson)
          })
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
  reader.readAsArrayBuffer(event.data);
};