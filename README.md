# Dynamic Data Table Manager

A modern, production-ready Dynamic Data Table Manager built with Next.js 14, Redux Toolkit, and Material UI. This application provides a comprehensive solution for managing tabular data with full CRUD operations, CSV import/export, real-time filtering, sorting, and customizable columns.

## Features

### Core Features
- **Dynamic Data Table**: Display data in a responsive table with row striping and sticky headers
- **Column Sorting**: Click column headers to sort data in ascending or descending order
- **Global Search**: Search across all visible columns with debounced input
- **Pagination**: Navigate through data with configurable rows per page
- **Manage Columns**: Show/hide columns, add custom fields, and reorder columns via drag-and-drop
- **CSV Import**: Import data from CSV files with validation and preview
- **CSV Export**: Export data to CSV with various options

### Bonus Features
- **Inline Editing**: Double-click cells to edit data with type-specific input controls
- **Row Actions**: Edit, delete, and duplicate rows with confirmation dialogs
- **Bulk Actions**: Select multiple rows for batch operations
- **Theme Toggle**: Switch between light and dark modes
- **Responsive Design**: Adapts to different screen sizes

## Tech Stack

- **Next.js 14** (App Router with TypeScript)
- **Redux Toolkit** (state management)
- **Redux Persist** (persist preferences)
- **Material UI** (UI components)
- **Tailwind CSS** (styling)
- **React Hook Form** (form handling)
- **Zod** (validation)
- **PapaParse** (CSV parsing)
- **FileSaver.js** (CSV export)
- **@dnd-kit** (drag-and-drop functionality)
- **next-themes** (theme management)

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone <repository-url>
   ```

2. Navigate to the project directory:
   ```bash
   cd dynamic-data-table
   ```

3. Install dependencies:
   ```bash
   npm install
   ```

### Development

Run the development server:
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to view the application.

### Building for Production

Build the application:
```bash
npm run build
```

Start the production server:
```bash
npm start
```

## Project Structure

```
src/
├── app/                 # Next.js app router pages
├── components/          # React components
│   ├── table/           # Table-related components
│   └── theme/           # Theme-related components
├── hooks/               # Custom React hooks
├── lib/                 # Utility functions and sample data
└── store/               # Redux store configuration
```

## Redux Store Structure

The Redux store manages the following state:

```typescript
{
  data: TableRow[]              // All table data
  columns: ColumnConfig[]       // Column definitions
  searchTerm: string            // Current search
  sorting: {
    sortBy: string | null
    sortDirection: 'asc' | 'desc' | null
  }
  pagination: {
    currentPage: number
    rowsPerPage: number
  }
  ui: {
    loading: boolean
    editingRowIds: string[]     // Rows in edit mode
    selectedRowIds: string[]    // Bulk selected
  }
  preferences: {
    theme: 'light' | 'dark'
    columnOrder: string[]
  }
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## License

This project is licensed under the MIT License.