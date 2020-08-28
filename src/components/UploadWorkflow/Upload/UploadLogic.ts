export default class UploadLogic {
  public static initDropZone(id: string, accept: string, uploadCallback: (file: File) => void) {
    const dropArea = document.getElementById(id);
    if (dropArea) {
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
            const file = dt.files[0];
            if (
              accept.split(",").filter((_) => file.name.endsWith(_))
                .length > 0
            ) {
              /* If a supported file. */
              uploadCallback(file);
            }
          }
        },
        false
      );
    }
  }
}