# Contract-Generator  

**Purpose**: A web app for editing templates with perfect Turkish character support in PDF exports.

## ✨ Features
- [x] Template management (read/edit)
- [x] Smart variable management 
- [x] Multi-page PDF generation
- [x] Real-time preview
- [ ] User authentication

## 🛠 Technical Stack
- Frontend: Vite + React (JavaScript)
- PDF Generation: pdf-lib + fontkit
- Routing: react-router-dom@7
- Styling: CSS Modules

## ⚠ Critical Notes
1. **Font Requirement**:  
   Must have `public/fonts/NotoSans-Regular.ttf` for proper rendering.

2. **Template Structure**:
   - Uses `{{variable}}` syntax for editable fields
   - Supports multi-line clauses
   - Automatic page breaking

3. **Testing**:
```javascript
// Verify contract variables
test('Fills contract variables correctly', () => {
  render(<ContractEditor />);
  expect(screen.getByLabelText('PEŞİNAT MİKTARI')).toBeInTheDocument();
});
```
  