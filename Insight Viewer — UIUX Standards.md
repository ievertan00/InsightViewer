------

# **Insight Viewer — UI/UX Standards**

------

## **1. Design Principles**

1. **Clarity First**
   - All screens must minimize cognitive load.
   - Use **structured layouts**, whitespace, and consistent typography.
   - Avoid narrative bias in charts or tables.
2. **Data Transparency**
   - All numbers, calculations, and signals should be traceable.
   - Hover or click interactions should provide source references and notes.
3. **Consistency Across Platforms**
   - Maintain uniform styling, color usage, and component behavior between web, desktop, and mobile.
4. **Guided Exploration**
   - Users should know **where to look next** via visual hierarchy, signals, and prompts.
   - Key metrics and red/green flags should be immediately visible.
5. **Modularity & Extensibility**
   - Reasoning, visualization, and export modules should be **plug-and-play** without redesigning the UI.

------

## **2. Layout & Navigation**

### **2.1 Global Layout**

- **Header:**
  - Logo + Product Name
  - User login / profile / settings
- **Sidebar (Left):**
  - Navigation: Upload, Data View, Signals, Visualizations, Interpretation, Export
  - Collapsible for mobile
- **Main Workspace:**
  - Dynamic panel showing charts, tables, or reasoning output
  - Supports multi-tab views for different reports

### **2.2 Page Layouts**

- **Upload & Parse:**
  - Drag-and-drop area + manual file selection
  - Clear progress indicator during parsing
- **Compute & Signal:**
  - Split view: Table of ratios & metrics on left, signals overview on right
  - Filters for period, company, or metric
- **Visualization:**
  - Interactive chart panels with legends and tooltips
  - Sync multiple charts to same time axis
- **Interpretation:**
  - Structured card layout: Company Summary, Signal Explanations, Trade-offs, Diligence Questions
- **Export:**
  - Select output format (PDF/Markdown)
  - Preview panel

------

## **3. Components**

| Component                  | Description                                               | UX Notes                                                |
| -------------------------- | --------------------------------------------------------- | ------------------------------------------------------- |
| **Tables**                 | Structured financial data                                 | Sortable, filterable, hover for notes, expandable rows  |
| **Charts**                 | Line, bar, waterfall, pie, synchronization timelines      | Interactive tooltips, zoom/pan, color-coded signals     |
| **Signal Cards**           | Red/Green flags                                           | Click expands explanations; editable rules icon visible |
| **Reasoning Cards**        | Interpretation output                                     | Highlight key metrics, questions, comparable benchmarks |
| **Buttons**                | Primary actions (Upload, Export)                          | Large, high-contrast, consistent placement              |
| **Tabs & Panels**          | Switch between computation, visualization, interpretation | Smooth animation, clear labels                          |
| **Search/Filter**          | Company, period, metrics                                  | Autocomplete, multi-select, persistent state            |
| **Notifications / Alerts** | System or API errors                                      | Toasts or banners, non-intrusive                        |

------

## **4. Colors & Typography**

### **4.1 Colors**

- **Primary:** Dark blue / navy (headers, nav)
- **Secondary:** Light gray (background, panels)
- **Signals:**
  - 🚩 Red Flag: #E53E3E
  - ✅ Green Flag: #38A169
- **Charts:** Distinct, muted palette for multiple metrics
- **Reasoning / Info:** Soft accent colors (yellow/orange) for highlights

### **4.2 Typography**

- **Font Family:** Sans-serif, e.g., Inter or Noto Sans SC (for Chinese + English support)
- **Hierarchy:**
  - H1: 24–28px (page titles)
  - H2: 20–22px (section headers)
  - H3: 16–18px (subsection / card titles)
  - Body: 14px (text & tables)
  - Monospace: For code, calculations, JSON snippets

------

## **5. Interaction Patterns**

- **Hover / Tooltip:** Show calculation details, source references, notes
- **Click to Expand:** Signal explanation, drill down charts, reasoning cards
- **Drag & Drop:** File upload & rearranging panels in dashboard
- **Responsive Feedback:** Buttons and actions provide loading, success, error states
- **Undo / Reset:** For editable signal rules

------

## **6. Responsiveness & Mobile**

- Collapsible sidebar, simplified header
- Vertical stacking of charts and tables
- Card-based layout for reasoning outputs
- Zoomable charts and scrollable tables
- Touch-friendly controls (buttons, toggles, sliders)

------

## **7. Accessibility**

- Minimum contrast ratio: 4.5:1 for text
- Keyboard navigation: all interactive elements
- Screen reader support: aria-labels for charts and tables
- Color-blind friendly palette for signals (use shapes/icons in addition to colors)

------

## **8. Export & Print**

- PDF / Markdown export maintains visual hierarchy
- Charts embedded with annotations
- Signal explanations and reasoning outputs structured as cards
- Option to include raw metrics table

------

## **9. UX Metrics for Evaluation**

- Time to locate critical signal (should be ≤ 10s)
- Ease of navigation (≤ 3 clicks to access any module)
- Comprehension test: users can interpret chart + reasoning without external help
- Export fidelity: report matches on-screen data

------

