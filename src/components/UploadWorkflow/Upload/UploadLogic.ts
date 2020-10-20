export default class UploadLogic {
  public static initDropZoneIds: string[] = [];
  public static initDropZone(id: string, accept: string, uploadCallback: (file: File) => void, multiple: boolean) {
    if (UploadLogic.initDropZoneIds.indexOf(id) > -1) {
      return;
    }
    const dropArea = document.getElementById(id);
    if (dropArea) {
      UploadLogic.initDropZoneIds.push(id);
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        dropArea.addEventListener(
          eventName,
          (e) => {
            e.preventDefault();
            e.stopPropagation();
          },
          false
        );
      });

      ["dragenter", "dragover"].forEach((eventName) => {
        dropArea.addEventListener(
          eventName,
          (e) => {
            dropArea.classList.add("highlight");
          },
          false
        );
      });

      ["dragleave", "drop"].forEach((eventName) => {
        dropArea.addEventListener(
          eventName,
          (e) => {
            dropArea.classList.remove("highlight");
          },
          false
        );
      });

      dropArea.addEventListener(
        "drop",
        (e) => {
          const dt = e.dataTransfer;
          if (dt) {
            const fnc = (file: File) => {
              if (
                accept.split(",").filter((_) => file.name.endsWith(_))
                  .length > 0
              ) {
                /* If a supported file. */
                uploadCallback(file);
              }
            };
            if (multiple) {
              Array.from(dt.files).forEach(file => {
                fnc(file);
              });
            } else {
              if (dt.files.length) {
                fnc(dt.files[0]);
              }
            }
          }
        },
        false
      );
    }
  }
}