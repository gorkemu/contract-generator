import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';

export async function generateContractPDF(title, content, variables) {
  const pdfDoc = await PDFDocument.create();
  pdfDoc.registerFontkit(fontkit);

  // Font yükleme
  const fontUrl = '/fonts/NotoSans-Regular.ttf';
  const fontBytes = await fetch(fontUrl).then(res => res.arrayBuffer());
  const font = await pdfDoc.embedFont(fontBytes);

  // Değişkenleri içeriğe yerleştirme
  let filledContent = content;
  Object.keys(variables).forEach(key => {
    filledContent = filledContent.replace(
      new RegExp(`{{${key}}}`, 'g'),
      variables[key] || `[${key}]`
    );
  });

  let page = pdfDoc.addPage([595, 842]); // A4
  let yPosition = 750;
  const margin = 50;
  const lineHeight = 14;
  const maxWidth = 495;

  // Metin çizme fonksiyonu
  const drawText = (text, size = 11, isBold = false, align = 'left') => {
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
        
        if (testWidth > maxWidth) {
          chunks.push(currentChunk);
          currentChunk = word;
        } else {
          currentChunk = testLine;
        }
      });
      
      if (currentChunk) chunks.push(currentChunk);

      // Çizim
      chunks.forEach(chunk => {
        let xPosition = margin;
        const textWidth = font.widthOfTextAtSize(chunk, size);
        
        if (align === 'center') {
          xPosition = (595 - textWidth) / 2;
        } else if (align === 'right') {
          xPosition = 595 - margin - textWidth;
        }

        page.drawText(chunk, {
          x: xPosition,
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
  drawText(title, 18, true, 'center');
  yPosition -= 20;

  // Bilgi tablosu (ilk 5 satır)
  const infoLines = filledContent.split('\n').slice(0, 5).join('\n');
  drawText(infoLines, 12, false, 'left');
  
  // Bölüm başlıkları ve içerik
  const sections = filledContent.split(/\n\s*\n/);
  sections.forEach((section, index) => {
    if (section.startsWith('**') && section.endsWith('**')) {
      // Bölüm başlığı
      drawText(section.replace(/\*\*/g, ''), 14, true, 'center');
      yPosition -= 10;
    } else if (section.includes('___________________')) {
      // İmza bölümü
      const signatureLines = section.split('\n');
      signatureLines.forEach((line, i) => {
        if (line.includes('Kiraya Veren') || line.includes('Kefil')) {
          drawText(line, 12, false, 'left');
        } else if (line.includes('Kiracı')) {
          drawText(line, 12, false, 'right');
        } else {
          drawText(line, 12, false, 'center');
        }
      });
    } else {
      // Normal içerik
      drawText(section, 12);
    }
  });

  return await pdfDoc.save();
}