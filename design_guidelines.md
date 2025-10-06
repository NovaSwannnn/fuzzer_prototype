# Design Guidelines: AI-Powered Fuzzer Dashboard

## Design Approach
**System-Based Approach** - Drawing inspiration from Linear's clean productivity interface, VSCode's developer-friendly aesthetic, and modern data visualization dashboards. This technical tool prioritizes clarity, real-time data visualization, and efficient workflow over decorative elements.

**Key Design Principles:**
- Information density with breathing room
- Real-time data visualization clarity
- Developer-centric ergonomics
- Performance-first interactions

---

## Core Design Elements

### A. Color Palette

**Dark Mode (Primary):**
- Background: 222 15% 8% (deep charcoal)
- Surface: 222 13% 12% (elevated panels)
- Surface Elevated: 222 12% 16% (cards, modals)
- Border: 222 10% 22% (subtle dividers)
- Text Primary: 222 5% 95% (high contrast)
- Text Secondary: 222 5% 65% (muted)
- Text Tertiary: 222 5% 45% (labels)

**Brand & Accent Colors:**
- Primary (LLM): 262 70% 62% (vibrant purple - represents AI/intelligence)
- Success (Coverage): 142 76% 56% (green - bug discoveries)
- Warning (Traditional): 38 92% 58% (amber - mutations)
- Danger (Crashes): 0 84% 60% (red - errors)
- Info (GA): 217 91% 60% (blue - genetic algorithm)

**Light Mode:**
- Background: 0 0% 98%
- Surface: 0 0% 100%
- Surface Elevated: 222 15% 97%
- Border: 222 8% 88%
- Text Primary: 222 15% 15%
- Text Secondary: 222 8% 40%

### B. Typography

**Font Families:**
- Primary: 'Inter' (UI text, labels, buttons)
- Monospace: 'JetBrains Mono' (code, JSON, terminal output)
- Data: 'Inter' with tabular-nums (metrics, numbers)

**Type Scale:**
- Display: text-4xl font-bold (dashboard headers)
- Heading 1: text-2xl font-semibold (section titles)
- Heading 2: text-xl font-medium (card headers)
- Body: text-sm (default text)
- Caption: text-xs (labels, metadata)
- Code: text-sm font-mono (technical content)

### C. Layout System

**Spacing Primitives:** Use Tailwind units of 2, 4, 6, 8, 12, 16, 24
- Tight spacing: p-2, gap-2 (inline elements, chips)
- Standard spacing: p-4, gap-4 (card padding, button spacing)
- Section spacing: p-6 to p-8 (major containers)
- Large spacing: p-12, gap-12 (page sections)

**Grid System:**
- Main dashboard: 12-column grid with gap-6
- Configuration sidebar: Fixed 320px width
- Content area: Fluid with max-w-7xl
- Data cards: 3-column grid (lg), 2-column (md), 1-column (sm)

---

## D. Component Library

### Navigation & Layout

**Top Navigation Bar:**
- Fixed height h-14, dark surface with subtle border-b
- Logo/title on left, status indicators center, user settings right
- Real-time connection status badge (connected/disconnected)
- Background blur backdrop-blur-sm for depth

**Sidebar Configuration Panel:**
- Collapsible left sidebar (320px width when open)
- Organized sections: Fuzzer Settings, Test Configuration, Advanced Options
- Toggle switches for boolean options
- Number inputs with +/- steppers
- Mode selector cards (visual selection for LLM vs Simulated)

### Core UI Elements

**Control Panel Card:**
- Elevated surface with border border-surface
- Header with icon + title + badge count
- Segmented controls for method selection (Traditional/LLM/GA)
- Primary action button (Start Fuzzing) - full width, h-10, prominent
- Secondary actions in icon button row

**Data Visualization Cards:**
- Glass-morphism effect: bg-surface/80 backdrop-blur-md
- Grid layout for metrics: 4 columns showing coverage, crashes, tests, time
- Large numbers (text-3xl font-bold) with small labels below
- Color-coded by metric type (success, warning, danger)
- Animated count-up on value changes

**Results Table:**
- Dense table with hover states
- Fixed header with sort indicators
- Row striping (odd:bg-surface/30)
- Status badges (pills with colored backgrounds)
- Monospace font for technical data columns
- Action buttons (icon only) in last column

**Real-time Log Terminal:**
- Full monospace font family
- Dark console appearance (bg-[#1a1b1e])
- Color-coded log levels: info (blue), success (green), warning (amber), error (red)
- Auto-scroll with sticky "pause auto-scroll" button
- Line numbers in text-tertiary
- Search/filter input at top

### Form Controls

**Input Fields:**
- Height h-10, rounded-md, border border-border
- Focus: ring-2 ring-primary/50 outline-none
- Dark: bg-surface text-primary
- Label above: text-xs font-medium text-secondary mb-1
- Helper text below: text-xs text-tertiary

**Buttons:**
- Primary: bg-primary text-white h-10 px-4 rounded-md font-medium
- Secondary: bg-surface border border-border
- Ghost: transparent hover:bg-surface/50
- Icon buttons: w-9 h-9 rounded-md centered icon
- Disabled state: opacity-50 cursor-not-allowed

**Toggle Switches:**
- Track: w-11 h-6 rounded-full transition-colors
- Thumb: w-5 h-5 rounded-full shadow-sm transform transition
- Active: bg-primary with thumb translate-x-5
- Inactive: bg-surface-elevated

**Select Dropdowns:**
- Match input styling, h-10 with chevron icon
- Dropdown panel: absolute z-50 shadow-xl border rounded-lg
- Options: py-2 px-3 hover:bg-surface cursor-pointer

### Data Displays

**Progress Indicators:**
- Linear progress: h-2 rounded-full bg-surface-elevated overflow-hidden
- Fill: bg-primary transition-all duration-300
- Label: text-xs above showing percentage
- Ring progress for circular (coverage metric)

**Badge/Chip Components:**
- Small: h-6 px-2 rounded-full text-xs font-medium
- Color variants: bg-{color}/10 text-{color} border border-{color}/20
- Status dots: w-2 h-2 rounded-full inline-block mr-1.5

**Charts (using Chart.js or Recharts):**
- Bar chart comparing method performance (time/coverage)
- Line chart showing coverage over time
- Donut chart for bug type distribution
- Dark theme colors, grid lines at border-color opacity

**Code Blocks:**
- JSON viewer with syntax highlighting
- Collapsible for long content
- Copy button in top-right corner
- Line numbers in gutter
- Light background (bg-surface) with subtle border

### Overlays

**Modal Dialogs:**
- Overlay: bg-black/60 backdrop-blur-sm
- Content: bg-surface rounded-lg shadow-2xl max-w-2xl
- Header: p-6 border-b
- Body: p-6
- Footer: p-6 border-t with action buttons right-aligned

**Toast Notifications:**
- Fixed bottom-right, stack with gap-2
- Slide in from right animation
- Auto-dismiss after 5s with progress bar
- Icon left, message center, close button right
- Variants: success (green), error (red), info (blue)

---

## E. Animations

**Use Sparingly:**
- Skeleton loading states for data cards (pulse animation)
- Smooth transitions on hover states (duration-200)
- Count-up animations for metrics
- Toast slide-in/out (duration-300)
- NO complex scroll animations or decorative effects

---

## Layout Specifications

### Dashboard Main View
- **Header (h-14):** Logo, status indicator, actions
- **Sidebar (320px, collapsible):** Configuration controls
- **Main Content Area (fluid):**
  - Stats grid (3 cols): Coverage, Crashes, Performance
  - Method selector cards (3 cols): Traditional, LLM, GA
  - Control panel: Start/Stop/Reset actions
  - Results section: Live log terminal + findings table
  - Charts section: Performance comparison graphs

### Configuration Sidebar Sections
1. **Fuzzer Mode:** Radio cards (Real LLM / Simulated)
2. **Test Parameters:** Number inputs (tests per method)
3. **Verbose Mode:** Toggle switch
4. **Advanced:** Collapsible section for expert settings

### Results Display
- Split view: 60% log terminal / 40% findings summary
- Tabbed interface: Overview, Traditional Results, LLM Results, GA Results
- Exportable data (JSON/CSV download buttons)

---

## Responsive Behavior
- Desktop (lg+): Full sidebar, 3-column grids
- Tablet (md): Collapsible sidebar, 2-column grids
- Mobile (sm): Bottom sheet sidebar, 1-column stack, simplified charts

---

## Key UI Patterns
- **Live Updates:** WebSocket indicators, auto-refreshing metrics
- **Status Communication:** Color-coded badges, progress indicators
- **Action Confirmation:** Modal for destructive actions (reset fuzzer)
- **Data Export:** Download buttons for logs and results
- **Method Comparison:** Side-by-side card comparison with visual metrics