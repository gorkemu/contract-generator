# Contract-Generator  

**Purpose**: A web app for creating and editing legal templates with perfect Turkish character support in PDF exports.

## ✨ Core Features
### Editing Capabilities
- [x] Dual-mode editing (variables & full content)
- [x] Clause management (add/remove paragraphs)
- [ ] Real-time preview with validation
### PDF Generation
- [x] Multi-page PDF generation with Turkish characters

## 🎯 User Interaction
### Editor Modes
```mermaid
graph TB
    A[Preview] -->|Double-click| B[Edit Variable]
    A -->|Long-press| B
    A -->|Content Mode| C[Edit Any Text]
    C -->|Add Clause| D[+ Button]
    C -->|Remove Clause| E[Delete Button]
```

### Keyboard Shortcuts
- `Enter`: Save edits
- `Escape`: Cancel edits
- `Ctrl+Z`: Undo (coming soon)

## 🛠 Technical Stack
### Frontend Stack
- Vite + React (JavaScript)
- PDF Generation: pdf-lib + fontkit
- State Management: React Context
- Routing: react-router-dom@7
### Backend Stack
- [Planned] MongoDB

### Styling & Interaction
- CSS Modules with responsive design
- Touch & mouse support
- In-place editing (double-click/long press)

## 🚀 Implementation Guide
### Prerequisites
```bash
# Font installation
mkdir -p public/fonts && curl -o public/fonts/NotoSans-Regular.ttf https://fonts.gstatic.com/s/notosans/v15/o-0IIpQlx3QUlC5A4PNr5TRF.ttf
```
### Development
```bash
npm install
```
### Deployment
```bash
npm run build
```
### Testing
```javascript
// Test clause management
test('Adds new contract clauses', () => {
  render(<ContractEditor />);
  userEvent.click(screen.getByText('+ Add Clause'));
  expect(screen.getByText('NEW CLAUSE')).toBeInTheDocument();
});
```
### Roadmap
- MongoDB integration for templates
- Undo/redo functionality
- Collaborative editing
- Template marketplace

   
## Important Notes
### Template Structure
```json
{
  "title": "Kira Sözleşmesi",
  "content": "Kiracı: {{kiracı}}\n\n**MADDELER**:\n1. {{madde1}}",
  "variables": {
    "kiracı": { "type": "text", "required": true }
  }
}
```

### Known Issues
1. Content persistence requires backend integration
2. Mobile touch gestures may need refinement
3. Canceling edits doesn't restore previous state


