# Contract-Generator  

**Purpose**: A web app for editing templates with perfect Turkish character support in PDF exports.

## ✨ Features
- [x] Template management (read/edit)
- [x] In-place variable editing (double-click/long press)
- [x] Multi-page PDF generation with Turkish characters
- [x] Real-time preview with validation
- [ ] User authentication

## 🛠 Technical Stack
- Frontend: Vite + React (JavaScript)
- PDF Generation: pdf-lib + fontkit
- Routing: react-router-dom@7
- Styling: CSS Modules
- Interaction: Touch & mouse support

## ⚠ Critical Notes
1. **Font Requirement**:  
   Must have `public/fonts/NotoSans-Regular.ttf` for proper Turkish character rendering.

2. **Template Structure**:
   - Uses `{{variable}}` syntax for editable fields
   - Supports multi-line clauses
   - Automatic page breaking
   - In-place editing (no separate form panel)

3. **Testing**:
```javascript
// Verify in-place editing
test('Edits variables directly in preview', () => {
  render(<ContractEditor />);
  const variableElement = screen.getByText('[kiracı]');
  fireEvent.doubleClick(variableElement);
  expect(screen.getByPlaceholderText('kiracı girin')).toBeInTheDocument();
});
```
## 🎯 New Interaction Guide
- **Edit Variables**: Double-click or long-press (1s) on any variable in the preview
- **Save Changes**: Press Enter or click outside the field
- **Cancel Edit**: Press Escape
- **Validation**: Empty required fields highlight in red