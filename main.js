const PDFJS = window["pdfjs-dist/build/pdf"];

const canvasContainer = document.querySelector("#canvas-container");
const input = document.querySelector("#file-input");

function loadPDF() {
  const file = input.files[0];

  const fileReader = new FileReader();
  fileReader.onload = function () {
    const arrayBuffer = this.result;

    const loadingTask = PDFJS.getDocument(arrayBuffer);

    loadingTask.promise.then(function (pdf) {
      const canvasArr = [];

      for (let i = 0; i < pdf.numPages; i++) {
        pdf.getPage(i + 1).then(function (page) {
          const scale = 1.5;
          const viewport = page.getViewport({ scale: scale });

          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");

          canvas.height = viewport.height;
          canvas.width = viewport.width;

          canvasContainer.appendChild(canvas);

          const renderContext = {
            canvasContext: context,
            viewport: viewport,
          };

          page.render(renderContext);

          canvasArr.push(canvas);
        });
      }
    });
  };
  fileReader.readAsArrayBuffer(file);
}

input?.addEventListener("change", (e) => {
  loadPDF();
});
