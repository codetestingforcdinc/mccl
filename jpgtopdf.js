// Wait for the DOM to load
document.addEventListener('DOMContentLoaded', () => {
  const fileInput = document.getElementById('fileInput');
  const convertBtn = document.getElementById('convertBtn');
  const resultDiv = document.getElementById('result');

  convertBtn.addEventListener('click', async () => {
    const file = fileInput.files[0];

    if (file) {
      try {
        const pdfDoc = await PDFLib.PDFDocument.create();
        const jpgImage = await pdfDoc.embedJpg(await file.arrayBuffer());

        const imageWidth = jpgImage.width;
        const imageHeight = jpgImage.height;

        const pageWidth = 595; // A4 width in points (210mm)
        const pageHeight = 842; // A4 height in points (297mm)

        const page = pdfDoc.addPage([pageWidth, pageHeight]);

        const imageAspectRatio = imageWidth / imageHeight;
        const pageAspectRatio = pageWidth / pageHeight;

        let drawWidth = pageWidth;
        let drawHeight = pageHeight;

        if (imageAspectRatio > pageAspectRatio) {
          drawHeight = (pageWidth / imageWidth) * imageHeight;
        } else {
          drawWidth = (pageHeight / imageHeight) * imageWidth;
        }

        const x = (pageWidth - drawWidth) / 2;
        const y = (pageHeight - drawHeight) / 2;

        page.drawImage(jpgImage, {
          x,
          y,
          width: drawWidth,
          height: drawHeight,
        });

        const pdfBytes = await pdfDoc.save();

        // Create a download link for the converted PDF
        const pdfDataUri = URL.createObjectURL(
          new Blob([pdfBytes], { type: 'application/pdf' })
        );

        const downloadLink = document.createElement('a');
        downloadLink.href = pdfDataUri;
        downloadLink.download = 'converted.pdf';
        downloadLink.textContent = 'Download converted PDF';

        resultDiv.innerHTML = '';
        resultDiv.appendChild(downloadLink);
      } catch (error) {
        console.error('Conversion error:', error);
      }
    }
  });
});
