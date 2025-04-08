// client/src/utils/pdfGenerator.js
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export async function generateContractPDF(elements) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  try {
    const fontUrl = '/fonts/NotoSans-Regular.ttf';
    const fontBytes = await fetch(fontUrl).then(res => {
      if (!res.ok) throw new Error(`Font yüklenemedi: ${res.status}`);
      return res.arrayBuffer();
    });
    const font = await pdfDoc.embedFont(fontBytes);

    let page = pdfDoc.addPage([595, 842]); // A4
    let yPosition = 750;  // Başlangıç konumu
    const margin = 50;
    const lineHeight = 14;
    const maxWidth = 495;

    const drawText = (text, size = 11, align = 'left') => {
      if (!text) return;

      const lines = text.split('\n');

      lines.forEach(line => {
        // Sayfa sonu kontrolü
        if (yPosition < 50) {
          page = pdfDoc.addPage([595, 842]);
          yPosition = 750;
        }

        const words = line.split(' ');
        let currentLine = '';

        words.forEach(word => {
          const testLine = currentLine ? `${currentLine} ${word}` : word;
          const testWidth = font.widthOfTextAtSize(testLine, size);

          if (testWidth > maxWidth) {
            drawLine(currentLine, size, align);
            currentLine = word;
          } else {
            currentLine = testLine;
          }
        });

        if (currentLine) {
          drawLine(currentLine, size, align);
        }

        yPosition -= 5; // Satır arası boşluk
      });
    };

    const drawLine = (line, size, align) => {
      let xPosition = margin;
      const textWidth = font.widthOfTextAtSize(line, size);

      if (align === 'center') {
        xPosition = (595 - textWidth) / 2;
      } else if (align === 'right') {
        xPosition = 595 - margin - textWidth;
      }

      page.drawText(line, {
        x: xPosition,
        y: yPosition,
        size,
        font,
        color: rgb(0, 0, 0)
      });

      yPosition -= lineHeight;  // Sonraki satır için y pozisyonu
    };

    if (Array.isArray(elements)) {
      const sortedElements = [...elements].sort((a, b) => a.order - b.order);

      sortedElements.forEach(element => {
        switch (element.type) {
          case 'title':
            // elements içindeki başlıkları (type === 'title') dahil edelim.
            drawText(element.content, 14, 'left'); // Başlıkları büyük yapmak isteyebilirsiniz
            break;
          case 'paragraph':
          default:
            drawText(element.content, 12, 'left');
        }
      });
    }

    return await pdfDoc.save();
  } catch (error) {
    console.error("PDF oluşturma hatası:", error);
    throw new Error(`PDF oluşturulamadı: ${error.message}`);
  }
}
