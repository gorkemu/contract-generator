import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export async function generateContractPDF(title, content) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // Font yükleme
  const fontUrl = '/fonts/NotoSans-Regular.ttf';
  const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
  const font = await pdfDoc.embedFont(fontBytes);

  let page = pdfDoc.addPage([595, 842]); // A4
  let yPosition = 750;
  const margin = 50;
  const lineHeight = 14;

  // Metin çizme fonksiyonu
  const drawText = (text, size = 11, isBold = false) => {
    const lines = text.split('\n');
    
    lines.forEach(line => {
      // Sayfa sonu kontrolü
      if (yPosition < 50) {
        page = pdfDoc.addPage([595, 842]);
        yPosition = 750;
      }

      // Uzun satırları bölme
      const chunks = [];
      let currentChunk = '';
      
      line.split(' ').forEach(word => {
        const testLine = currentChunk ? `${currentChunk} ${word}` : word;
        const testWidth = font.widthOfTextAtSize(testLine, size);
        
        if (testWidth > 495) {
          chunks.push(currentChunk);
          currentChunk = word;
        } else {
          currentChunk = testLine;
        }
      });
      
      if (currentChunk) chunks.push(currentChunk);

      // Çizim
      chunks.forEach(chunk => {
        page.drawText(chunk, {
          x: margin,
          y: yPosition,
          size,
          font,
          color: rgb(0, 0, 0),
          weight: isBold ? 'bold' : 'normal'
        });
        yPosition -= lineHeight;
      });
    });
    yPosition -= 5;
  };

  // Başlık
  drawText(title, 16, true);
  
  // İçerik
  const sections = content.split(/\n\s*\n/);
  sections.forEach(section => {
    drawText(section);
  });

  return await pdfDoc.save();
}