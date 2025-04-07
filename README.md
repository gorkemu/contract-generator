# Contract-Generator

A web application for creating, editing, and managing form templates with full Turkish character support and PDF export capabilities.

## Features

### Core Functionality
- **Template Editing**
  - Dual-mode editor (variables vs full content)
  - Paragraph-level editing (add/remove/reorder clauses)
  - Snap-to-grid alignment (16px grid system)
  - Drag-and-drop paragraph reorganization
  - Real-time preview with validation

- **Document Management**
  - Save edited templates to database
  - Load previously saved contracts
  - Auto-save functionality (planned)
  - Version history (planned)

- **PDF Generation**
  - Flawless Turkish character rendering
  - Multi-page document support
  - Required field validation
  - Visual error indicators

### User Interaction
- Double-click/long-press to edit variables
- Content mode for full document editing
- Add/remove clauses with + and - buttons
- Drag handles for paragraph reorganization
- Grid toggle for precise alignment

## Technical Implementation

### Frontend
- **Framework**: React + Vite
- **PDF Generation**: pdf-lib with fontkit integration
- **State Management**: React Context + useState
- **Routing**: react-router-dom v7
- **Styling**: CSS Modules with responsive design
- **UI Features**:
  - Loading spinners for async operations
  - Success/error notifications
  - Mobile-optimized touch targets

### Backend
- **Runtime**: Node.js + Express
- **Database**: MongoDB (Mongoose ODM)
- **API Endpoints**:
  - `GET /api/contracts` - List all templates
  - `POST /api/contracts` - Create new template
  - `PATCH /api/contracts/:id` - Update existing
  - `DELETE /api/contracts/:id` - Remove template

## Recent Updates
- Implemented template persistence system
- Unified action button styling (Save/Export)
- Enhanced mobile responsiveness
- Added visual feedback mechanisms:
  - Operation loading indicators
  - Success confirmation states
  - Validation error highlighting

## Usage Example

1. Select a template from your library
2. Edit variables by double-clicking
3. Switch to content mode for full editing:
   - Add/remove paragraphs
   - Reorder clauses via drag-and-drop
4. Toggle grid alignment when needed
5. Save your edited template
6. Export to PDF when ready

## Roadmap

### Near-term
- [ ] Auto-save functionality
- [ ] Template version history
- [ ] Dark mode support

### Future
- [ ] Collaborative editing
- [ ] Template sharing via link
- [ ] Electronic signature support
- [ ] Template marketplace

