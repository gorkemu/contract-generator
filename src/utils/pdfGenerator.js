// src/utils/pdfGenerator.js
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export async function generateContractPDF(title, content) {
  try {
    // 1. Create PDF
    const pdfDoc = await PDFDocument.create();
    pdfDoc.registerFontkit(fontkit);

    // 2. Load font (from public/fonts)
    const fontUrl = '/fonts/NotoSans-Regular.ttf';
    const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
    const font = await pdfDoc.embedFont(fontBytes);

    // 3. Add content
    const page = pdfDoc.addPage([595, 842]); // A4 size
    
    // Title
    page.drawText(title, {
      x: 50,
      y: 800,
      size: 16,
      font,
      color: rgb(0, 0, 0)
    });

    // Content with line breaks
    content.split('\n').forEach((line, i) => {
      page.drawText(line, {
        x: 50,
        y: 750 - (i * 20), // Line spacing
        size: 12,
        font,
        color: rgb(0, 0, 0)
      });
    });

    // 4. Return as Blob for direct download
    const pdfBytes = await pdfDoc.save();
    return new Blob([pdfBytes], { type: 'application/pdf' });

  } catch (error) {
    console.error('PDF generation error:', error);
    throw new Error('PDF oluşturulamadı');
  }
}