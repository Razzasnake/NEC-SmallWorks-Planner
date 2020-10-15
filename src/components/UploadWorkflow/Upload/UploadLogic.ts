export default class UploadLogic {
  public static initDropZone(id: string, accept: string, uploadCallback: (file: File) => void, multiple: boolean) {
    let dropArea = document.getElementById(id);
    if (dropArea) {
      if (dropArea.parentNode) {
        dropArea.parentNode.replaceChild(dropArea.cloneNode(true), dropArea);
        dropArea = document.getElementById(id);
      }
      ["dragenter", "dragover", "dragleave", "drop"].forEach((eventName) => {
        if (dropArea) {
          dropArea.addEventListener(
            eventName,
            (e) => {
              e.preventDefault();
              e.stopPropagation();
            },
            false
          );
        }
      });

      ["dragenter", "dragover"].forEach((eventName) => {
        if (dropArea) {
          dropArea.addEventListener(
            eventName,
            (e) => {
              if (dropArea) {
                dropArea.classList.add("highlight");
              }
            },
            false
          );
        }
      });

      ["dragleave", "drop"].forEach((eventName) => {
        if (dropArea) {
          dropArea.addEventListener(
            eventName,
            (e) => {
              if (dropArea) {
                dropArea.classList.remove("highlight");
              }
            },
            false
          );
        }
      });

      if (dropArea) {
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
                fnc(dt.files[0]);
              }
            }
          },
          false
        );
      }
    }
  }
}