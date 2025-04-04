# Contract-Generator  

**Purpose**: A web app for editing templates with perfect Turkish character support in PDF exports.

## ✨ Features
- [x] Template management (read/edit)
- [x] Stable text editor with Turkish support
- [x] Professional PDF export (pdf-lib)
- [ ] Dynamic field detection
- [ ] User authentication

## 🛠 Technical Stack
- Frontend: Vite + React (JavaScript)
- PDF Generation: pdf-lib + fontkit
- Routing: react-router-dom@7
- Styling: CSS Modules

## ⚠ **Önemli Notlar**  
1. **Font Gereksinimi**:  
   Projeyi çalıştırmak için `public/fonts/NotoSans-Regular.ttf` dosyası zorunludur.

2. **Test Senaryoları**:  
   ```javascript
   // PDF Türkçe karakter testi
   test('PDF should render Turkish chars correctly', async () => {
     const pdf = await generateContractPDF("Test", "İşğüçŞÖÇ");
     expect(pdf).toBeValidPDFWithText("İşğüçŞÖÇ");
   });

3. **TypeScript**: Proje saf JavaScript olarak devam edecek.   