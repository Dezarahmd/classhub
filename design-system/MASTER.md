# ClassHub — Master Design System

**Version:** 1.4.0
**Design Direction:** Academic Monochrome  
**Visual Style:** Minimalism & Swiss Style  
**Product Type:** Academic Management Dashboard  
**Status:** Approved Design Direction — Implementation Pending

---

## 1. Product Overview

ClassHub is an academic management application designed to help students organize classroom activities, assignments, schedules, learning materials, groups, and announcements.

### Technology Stack

- Frontend: React.js
- Styling: Tailwind CSS
- Backend: Supabase
- Routing: React Router
- Icons: Lucide React
- UI/UX Reference: UI UX Pro Max

### Target Users

- Students
- Class leaders (Ketua)
- Deputy class leaders (Wakil)

### Design Direction

Academic Monochrome — professional, minimal, functional, focused, and student-friendly.

The visual identity combines a monochromatic foundation, dark sidebar, black primary actions, and controlled blue accents.

Prioritize dashboard usability, information hierarchy, accessibility, and task efficiency over decorative or marketing-oriented design patterns.

### Design Research Foundation

The approved direction adapts recommendations from UI UX Pro Max:

- Minimalism & Swiss Style: visual foundation.
- Bento Box Grid: modular component organization.
- Executive Dashboard: at-a-glance information presentation.
- Monochrome + Blue Accent: color direction.

External recommendations must be adapted to academic dashboard requirements rather than applied without evaluation.

## 2. Design Principles

- Functionality before decoration.
- Maintain the Academic Monochrome visual identity.
- Use neutral colors as the visual foundation.
- Use blue accents selectively for meaningful interactions.
- Prioritize clear information hierarchy.
- Use semantic design tokens instead of arbitrary colors.
- Design reusable and maintainable components.
- Support responsive layouts and accessible interactions.
- Preserve existing functionality and business logic.
- Avoid unnecessary dependencies and visual complexity.
- Avoid decorative gradients, excessive shadows, and unnecessary animations.
- Use progressive disclosure when presenting complex information.

## 3. Color System

This document defines the approved target color system.

The source of truth for currently implemented color tokens remains `src/index.css`.

The existing Modern Orange implementation must be migrated through a separate approved feature branch.

Until migration is completed, the approved target palette and implemented palette may differ.

### 3.1 Brand Colors

| Token | Hex | Usage |
|---|---|---|
| primary | #18181B | Primary actions and brand identity |
| primary-hover | #27272A | Primary action hover |
| primary-light | #F4F4F5 | Subtle monochromatic backgrounds |
| on-primary | #FFFFFF | Content on primary backgrounds |
| accent | #2563EB | Links, focus rings, interactive accents |
| accent-hover | #1D4ED8 | Accent hover state |
| accent-light | #EFF6FF | Selected states on light surfaces |

### 3.2 Sidebar Colors

| Token | Hex | Usage |
|---|---|---|
| sidebar | #18181B | Sidebar background |
| sidebar-hover | #27272A | Navigation hover |
| sidebar-active | #272F45 | Active navigation background |
| sidebar-foreground | #FFFFFF | Primary sidebar text |
| sidebar-muted | #A1A1AA | Secondary sidebar text |
| sidebar-accent | #93C5FD | Active navigation content |
| sidebar-border | #3F3F46 | Sidebar borders and dividers |
| sidebar-danger | #F87171 | Logout hover foreground |
| sidebar-danger-light | #301A20 | Logout hover background |

### 3.3 Layout Colors

| Token | Hex | Usage |
|---|---|---|
| background | #FAFAFA | Application background |
| surface | #FFFFFF | Cards, forms, and modals |
| foreground | #09090B | Primary content |
| muted | #52525B | Secondary content |
| border | #E4E4E7 | Decorative borders and dividers |
| input-border | #71717A | Form control boundaries |

### 3.4 Semantic Colors

| Token | Hex | Usage |
|---|---|---|
| success | #15803D | Successful and completed states |
| success-light | #F0FDF4 | Success background |
| warning | #B45309 | Warning and approaching deadlines |
| warning-light | #FFFBEB | Warning background |
| danger | #B91C1C | Errors, overdue states, and destructive actions |
| danger-hover | #991B1B | Destructive action hover |
| danger-light | #FEF2F2 | Danger background |
| on-danger | #FFFFFF | Content on destructive action backgrounds |
| info | #1D4ED8 | Information and in-progress states |
| info-light | #EFF6FF | Information background |
| neutral-light | #F4F4F5 | Neutral background |
| neutral-foreground | #52525B | Neutral content |

### 3.5 Status Mapping

| Status | Semantic Color |
|---|---|
| Not Started | Neutral |
| In Progress | Info |
| Completed | Success |
| Approaching Deadline | Warning |
| Overdue | Danger |

Status information must not rely on color alone.

Use descriptive labels and appropriate icons when necessary.

Deadline urgency and assignment progress are distinct concepts. An approaching deadline does not automatically change a student's progress status.

The existing Dashboard Summary and Tasks Page do not yet fully follow this mapping.

### 3.6 Color Usage Rules

- Use semantic Tailwind utilities such as `bg-primary`, `text-foreground`, and `border-border`.
- Use black for primary actions.
- Use blue for interactive accents, links, and focus indicators.
- Use blue accents selectively to maintain visual hierarchy.
- Avoid introducing arbitrary brand colors.
- Avoid direct palette utilities when an appropriate semantic token exists.
- Reserve semantic colors for meaningful feedback.
- Do not use the primary brand color for destructive actions.
- Use danger, danger-hover, and on-danger for destructive buttons.
- Use sidebar-danger and sidebar-danger-light for logout hover states on dark sidebar surfaces.
- Distinguish interactive blue accents from informational status indicators through labels and context.
- Verify contrast before approving new color combinations.
- Do not assume every existing color combination meets WCAG requirements.

### 3.7 Visual Color Composition

Recommended visual balance:

- 70% light neutral surfaces.
- 20% dark neutral elements.
- 10% accent and semantic colors.

These proportions are visual guidelines, not mandatory layout dimensions.

### 3.8 Color Migration Rules

- Preserve existing semantic token names where their purpose remains unchanged.
- Introduce accent tokens for interactive elements.
- Introduce sidebar-border for dark sidebar boundaries.
- Introduce input-border for accessible form control boundaries.
- Audit components that currently use primary colors for non-primary actions.
- Replace unnecessary hardcoded blue, orange, slate, and gray utilities.
- Verify focus indicators on both light and dark surfaces.
- Do not modify application functionality solely to migrate colors.

## 4. Typography System

### Font Family

Use the default Tailwind sans-serif font stack.

No custom font family has been approved.

Typography should provide the primary visual hierarchy within the monochromatic interface.

### Typography Scale

| Element | Size | Weight | Tailwind |
|---|---|---|---|
| Page heading | 30px | 700 | text-3xl font-bold |
| Metric value | 24px | 700 | text-2xl font-bold |
| Modal title | 20px | 600 | text-xl font-semibold |
| Section heading | 18px | 700 | text-lg font-bold |
| Card heading | 18px | 600 | text-lg font-semibold |
| Body text | 16px | 400 | text-base |
| Secondary text | 14px | 400 | text-sm |
| Form label | 14px | 500 | text-sm font-medium |
| Navigation label | 14px | 500 | text-sm font-medium |
| Caption | 12px | 400 | text-xs |
| Status badge | 12px | 500–600 | text-xs |

### Typography Rules

- Maintain a clear heading hierarchy.
- Use semantic HTML heading elements.
- Reserve the page-level heading for main page content; sidebar branding uses non-heading text.
- Avoid excessive font weights and sizes.
- Use foreground tokens for primary text.
- Use muted tokens for secondary information.
- Maintain readable line heights.
- Avoid oversized marketing-oriented typography.
- Avoid using typography solely for decorative purposes.

## 5. Spacing System

ClassHub uses the default Tailwind spacing scale based on 4px increments at the default root font size.

| Value | Tailwind Unit | Typical Usage |
|---|---|---|
| 4px | 1 | Label spacing |
| 8px | 2 | Small component gaps |
| 12px | 3 | Input padding and icon gaps |
| 16px | 4 | Form spacing and grid gaps |
| 20px | 5 | Card and sidebar padding |
| 24px | 6 | Modal and content padding |
| 32px | 8 | Section spacing and desktop content padding |
| 40px | 10 | Major separation |

Prefer existing spacing utilities before introducing custom values.

Use whitespace to communicate hierarchy without reducing information density unnecessarily.

## 6. Border Radius System

| Token | Value | Usage |
|---|---|---|
| rounded-lg | 8px | Inputs, compact buttons, icon buttons |
| rounded-xl | 12px | Navigation, task cards, modals, form submit buttons |
| rounded-2xl | 16px | Summary cards and authentication cards |
| rounded-full | Full | Status and role badges |

Maintain consistent radius values within the same component family.

The existing radius system is intentionally preserved instead of adopting the sharp corners of traditional Swiss Style.

## 7. Shadow System

| Utility | Usage |
|---|---|
| shadow-none | Flat surfaces where appropriate |
| shadow-sm | Standard cards and subtle elevation |
| shadow-md | Elevated interactive component state |
| shadow-lg | Authentication card baseline |
| shadow-xl | Modal dialog |

Prefer clean borders and subtle elevation.

Use shadows to communicate hierarchy rather than decoration.

Avoid excessive shadows, decorative glow effects, and unnecessary visual depth.

Non-interactive cards should not imply clickability through excessive hover effects.

## 8. Iconography

Use Lucide React as the primary icon library.

| Context | Icon Size |
|---|---|
| Compact actions | 16px |
| Form actions | 16px |
| Sidebar navigation | 19px |
| Modal close button | 20px |
| Summary cards | 21px |
| Authentication brand icon | 32px |

### Icon Rules

- Use consistent icon styles.
- Do not use emojis as interface icons.
- Provide accessible names for icon-only buttons.
- Hide purely decorative icons from assistive technologies when appropriate.
- Maintain sufficient contrast.
- Use neutral icons for standard content.
- Use accent colors for meaningful interactive states.
- Use semantic colors for status indicators.
- Avoid mixing multiple icon libraries without approval.

## 9. Layout System

### 9.1 Application Shell

The current application shell consists of a sidebar and main content area.

| Property | Current Value |
|---|---|
| Sidebar width | 256px |
| Sidebar padding | 20px |
| Application height | 100vh |
| Main content padding | 24px |
| Desktop content padding | 32px |
| Desktop layout breakpoint | 768px |
| Main content scrolling | Vertical |

Provide a keyboard-accessible skip link before sidebar navigation. Keep it visually hidden until focused and move focus to the main content landmark when activated. Use `tabIndex={-1}` on the main landmark for programmatic focus without adding a sequential tab stop.

### 9.2 Sidebar

The approved design uses a dark sidebar with controlled blue accents.

- Background: sidebar token.
- Navigation radius: 12px.
- Horizontal item padding: 16px.
- Vertical item padding: 12px.
- Navigation item gap: 8px.
- Icon and label gap: 12px.
- Active background: sidebar-active.
- Active content: sidebar-accent.
- Default content: sidebar-muted.
- Hover background: sidebar-hover.
- Hover content: sidebar-foreground.
- Dividers: sidebar-border.
- Logout default content: sidebar-muted.
- Logout hover background: sidebar-danger-light.
- Logout hover content: sidebar-danger.
- Logout keyboard focus: sidebar-accent with sidebar ring offset.

Use appropriate active navigation semantics, including `aria-current` where applicable. Active navigation also uses a visible vertical indicator with the sidebar-accent token, so selection is not conveyed by color changes alone.

Preserve role-based navigation and permission checks.

Mobile navigation is a planned improvement and is not yet implemented.

### 9.3 Page Structure

Recommended page structure:

1. Page heading.
2. Supporting description.
3. Primary page action, when applicable.
4. Filters or secondary controls, when necessary.
5. Main content.
6. Loading, empty, error, and success feedback.

Maintain consistent content spacing and alignment.

### 9.4 Modular Grid

Adapt Bento Box principles for functional dashboard organization.

- Use modular cards with consistent spacing.
- Group related information.
- Maintain predictable reading order.
- Prefer symmetrical grids for equivalent information.
- Use larger card spans only when content requires them.
- Avoid decorative asymmetric layouts.
- Preserve responsive grid behavior.

## 10. Component Standards

### 10.1 Summary Cards

Current structural baseline:

- Surface background.
- Semantic border.
- 16px border radius.
- 20px padding.
- Small shadow.
- 44px icon container.
- 21px Lucide icon.
- 24px bold metric.
- 16px grid gap.

Target visual treatment:

- Neutral card surfaces.
- Strong typography hierarchy.
- Semantic icon colors for assignment statuses.
- Minimal elevation.
- No decorative gradients.
- No unnecessary hover scaling or movement.

Responsive grid:

- Below 640px: one column.
- From 640px: two columns.
- From 1280px: four columns.

Dashboard metrics currently use static data and must not be treated as live assignment statistics.

### 10.2 Task Cards

- Surface background.
- Semantic border.
- 12px border radius.
- 20px padding.
- Small shadow.
- 18px semibold title.
- 14px secondary information.
- Semantic status badges.
- Accessible edit and delete actions.
- 16px grid gap.

Responsive grid:

- Below 768px: one column.
- From 768px: two columns.

### 10.3 Primary Buttons

Use:

- `bg-primary`
- `text-on-primary`
- `hover:bg-primary-hover`
- `font-medium`
- `transition-colors`

Primary buttons use black backgrounds with white content.

Compact button baseline:

- Radius: 8px.
- Horizontal padding: 16px.
- Vertical padding: 8px.

Form submit button baseline:

- Radius: 12px.
- Horizontal padding: 16px.
- Vertical padding: 12px.
- Icon gap: 8px.

Required interaction states:

- Default.
- Hover.
- Keyboard focus.
- Disabled.
- Loading, when applicable.

Use descriptive loading text and prevent duplicate submissions.

### 10.4 Secondary Buttons

- Neutral-light background.
- Neutral-foreground text.
- Semantic hover background.
- Consistent padding and border radius.
- Visible keyboard focus state.

Use secondary buttons for cancellation and supporting actions.

### 10.5 Destructive Buttons

- Default background: `bg-danger`.
- Foreground: `text-on-danger`.
- Enabled hover background: `enabled:hover:bg-danger-hover`.
- Visible keyboard focus using the accent token.
- Clear destructive action label.
- Confirmation dialog when appropriate.
- Loading and disabled states during processing.

Do not use the primary brand color to represent destructive actions.

### 10.6 Form Controls

Current AssignmentForm structural baseline:

- Full-width inputs.
- Surface background.
- 8px border radius.
- 12px padding.
- 14px input text.
- 14px medium labels.
- 4px label spacing.
- 16px form spacing.

Approved target styling:

- Input-border token for control boundaries.
- Foreground token for input content.
- Muted token for supporting text.
- Accent token for focus indicators.
- Danger token for validation errors.
- Visible focus indicator with sufficient contrast.

Required standards:

- Associate every input with an accessible label.
- Provide clear validation feedback.
- Indicate required fields visually and programmatically.
- AssignmentForm currently uses `aria-required="true"` for title, subject, and deadline; description remains optional. Existing JavaScript validation is preserved. Visual required-field indicators and inline validation remain future improvements.
- Preserve entered values when recoverable errors occur.
- Provide loading and empty states for asynchronous selections.
- Prevent duplicate submissions.
- Prefer inline validation over browser alert dialogs.

### 10.7 Modal Dialogs

Current structural baseline:

| Property | Value |
|---|---|
| Overlay | Black at 50% opacity |
| Z-index | 50 |
| Maximum width | 512px |
| Maximum height | 90vh |
| Border radius | 12px |
| Padding | 24px |
| Shadow | shadow-xl |
| Title | 20px semibold |

Preserve existing modal behavior:

- React Portal.
- Dialog role.
- Accessible title.
- Accessible close button.
- Escape key support.
- Keyboard focus trapping.
- Focus restoration.
- Body scroll locking.
- Internal vertical scrolling.

Verify keyboard behavior and focus management before approving modal changes.

### 10.8 Status Badges

- Full border radius.
- 12px text.
- Medium or semibold weight.
- 12px horizontal padding.
- 4px vertical padding.
- Semantic background and foreground colors.
- Descriptive status labels.

### 10.9 Authentication

The existing Login Page uses a legacy blue and gray palette.

Future authentication improvements must align with Academic Monochrome:

- Neutral application background.
- White authentication card.
- Black primary submit button.
- Blue focus indicators and interactive links.
- Semantic error feedback.
- Minimal visual decoration.

Preserve:

- Supabase authentication.
- Class membership verification.
- Email and password validation.
- Password visibility controls.
- Autocomplete attributes.
- Loading states.
- Error feedback.
- Redirect behavior.

Password visibility controls use an action-oriented accessible name that changes between show and hide, without `aria-pressed`. Provide a persistent `role="status"` region for login processing feedback.

Authentication styling changes must not modify authentication business logic without explicit approval.

### 10.10 Links and Interactive Accents

- Default color: accent.
- Hover color: accent-hover.
- Selected background: accent-light.
- Visible keyboard focus.
- Clear distinction from non-interactive text.
- Underline text links where necessary to avoid relying on color alone.

Use sidebar-accent for appropriate interactions on dark sidebar surfaces.

### 10.11 NotFound Page

Place the primary dashboard link before the secondary previous-page button in both DOM and visual order at all breakpoints. Preserve visible keyboard focus and existing navigation behavior. Avoid CSS reversal that makes visual and sequential focus order inconsistent.

## 11. Interaction and Motion

### Target Standards

- Default transition duration: 200ms.
- Acceptable transition range: 150–300ms.
- Prefer targeted color, opacity, and shadow transitions.
- Avoid unnecessary `transition-all`.
- Avoid hover effects that cause layout shifts.
- Use pointer cursors for clickable controls.
- Provide visible keyboard focus states.
- Respect `prefers-reduced-motion`.
- Avoid unnecessary animation on non-interactive components.
- Avoid decorative KPI animations.
- Provide immediate visual feedback after user actions.

Existing components do not yet consistently implement all these standards.

## 12. Responsive Design

Use a mobile-first approach.

### Breakpoints

| Breakpoint | Minimum Width |
|---|---|
| Base | Below 640px |
| sm | 640px |
| md | 768px |
| lg | 1024px |
| xl | 1280px |
| 2xl | 1536px |

### Required Verification Widths

- 375px.
- 768px.
- 1024px.
- 1440px.

### Responsive Rules

- Prevent unintended horizontal scrolling.
- Preserve access to all primary actions.
- Adapt navigation for smaller screens.
- Stack content when horizontal space is limited.
- Keep important information visible on mobile.
- Ensure modals fit within the viewport.
- Avoid fixed widths that exceed available space.
- Maintain usable touch targets.

Current mobile layout behavior requires improvement and browser verification.

## 13. Accessibility

Target WCAG 2.2 Level AA where applicable.

### Requirements

- Use semantic HTML.
- Provide accessible form labels.
- Provide accessible names for icon-only controls.
- Maintain visible keyboard focus.
- Support keyboard navigation.
- Preserve logical focus order.
- Provide meaningful loading and error feedback.
- Avoid using color as the only status indicator.
- Respect reduced-motion preferences.
- Maintain at least 4.5:1 contrast for normal text.
- Maintain at least 3:1 contrast for large text.
- Maintain applicable 3:1 non-text contrast requirements.
- Meet applicable minimum target-size requirements.
- Prefer 44px touch targets where practical.

### Language, Navigation, and Dynamic Feedback

- Set the document language to Indonesian (`lang="id"`) for the current interface.
- Provide a skip navigation link and logical DOM-based focus order. Avoid positive tabindex values.
- Use persistent `role="status"` regions for non-urgent asynchronous feedback and `role="alert"` for relevant errors.
- TasksPage uses status feedback for loading, empty results, and deletion processing, with alert semantics for fetch and delete errors.
- AssignmentForm uses status feedback for subject loading, empty results, and saving, with alert semantics for subject and submit errors.
- Preserve visible feedback and avoid redundant announcements where practical. Test actual announcements with assistive technology; initial content in a newly mounted live region may not be announced.

### Color Accessibility

- Use high-contrast monochromatic typography.
- Verify white text on black primary buttons.
- Verify blue links on light surfaces.
- Verify sidebar text and active navigation states.
- Verify semantic status badge contrast.
- Verify danger text on danger-light surfaces.
- Verify on-danger content on danger and danger-hover backgrounds.
- Verify sidebar-danger content on sidebar-danger-light backgrounds.
- Verify form control boundaries.
- Verify focus indicators against adjacent surfaces.
- Use distinct focus treatments for light and dark surfaces when necessary.

Accessibility compliance must be verified through testing rather than assumed from source code, design research, or palette selection alone.

## 14. Known Issues and Improvement Backlog

| ID | Improvement | Priority |
|---|---|---|
| UI-001 | Mobile sidebar and responsive application shell | High |
| UI-002 | Replace static dashboard metrics with actual data | High |
| UI-003 | Standardize assignment status mapping and overdue display | High |
| UI-004 | Align Login Page with Academic Monochrome | Medium |
| UI-005 | Standardize buttons and card variants | Medium |
| UI-006 | Improve keyboard focus and accessibility | Medium |
| UI-007 | Replace alert-based validation with inline feedback | Medium |
| UI-008 | Add reduced-motion support | Medium |
| UI-009 | Replace unnecessary direct palette utilities | Medium |
| UI-010 | Verify and remove unused legacy CSS | Low |
| UI-011 | Connect dashboard action buttons to their intended functionality | High |
| UI-012 | Preserve deadline visibility on mobile | High |
| UI-013 | Remove duplicate deadline presentation | Medium |
| UI-014 | Implement or remove the inactive password recovery link | Medium |
| UI-015 | Migrate Modern Orange tokens to Academic Monochrome | High |
| UI-016 | Verify color contrast after palette migration | High |

Each improvement must be implemented through a separate approved Git branch.

Do not treat backlog items as completed features.

## 15. UI/UX Development Workflow

For every UI/UX task:

1. Analyze requirements.
2. Read this master design system.
3. Check approved page-specific overrides.
4. Review the existing implementation.
5. Consult UI UX Pro Max recommendations.
6. Perform additional domain searches when necessary.
7. Apply React and Tailwind CSS guidelines.
8. Explain proposed changes.
9. Obtain approval before implementation.
10. Implement and verify the approved changes.

### Design System Hierarchy

- `design-system/MASTER.md`: Approved global design standards.
- `design-system/pages/`: Approved page-specific overrides.
- `src/index.css`: Currently implemented design tokens.
- UI UX Pro Max: Research and recommendation reference.

Approved page-specific overrides take precedence over global component defaults for their respective pages.

External recommendations must not automatically replace approved ClassHub design standards.

### Git Workflow

- Create a separate branch for every feature, bug fix, refactor, or configuration change.
- Commit and push each completed and verified small feature.
- Merge completed branches into main.
- Push main after merging.

## 16. Pre-Delivery Checklist

### Visual Consistency

- [ ] Academic Monochrome identity preserved.
- [ ] Dark sidebar follows approved tokens.
- [ ] Black primary actions used consistently.
- [ ] Blue accents used selectively.
- [ ] Semantic color tokens used.
- [ ] Typography hierarchy consistent.
- [ ] Spacing consistent.
- [ ] Border radius consistent.
- [ ] Shadows appropriate.
- [ ] Lucide icons used consistently.

### Accessibility

- [ ] Accessible labels provided.
- [ ] Keyboard navigation verified.
- [ ] Document language and heading hierarchy verified.
- [ ] Skip navigation and logical visual/focus order verified.
- [ ] Required-field semantics and visible instructions verified.
- [ ] Dynamic feedback announcements verified with assistive technology where applicable.
- [ ] Focus indicators visible.
- [ ] Color contrast verified.
- [ ] Form control boundaries verified.
- [ ] Status information does not rely on color alone.
- [ ] Reduced-motion preferences respected.
- [ ] Touch targets verified.

### Responsiveness

- [ ] Tested at 375px.
- [ ] Tested at 768px.
- [ ] Tested at 1024px.
- [ ] Tested at 1440px.
- [ ] No unintended horizontal scrolling.
- [ ] Important information remains accessible.
- [ ] Navigation remains usable.

### Interaction and Functionality

- [ ] Hover states verified.
- [ ] Focus states verified.
- [ ] Disabled states verified.
- [ ] Loading states verified.
- [ ] Empty states verified.
- [ ] Error states verified.
- [ ] Success feedback verified where applicable.
- [ ] Existing business logic preserved.
- [ ] Role-based permissions preserved.
- [ ] Supabase functionality preserved.

### Technical Verification

- [ ] Build completed successfully.
- [ ] Lint checks completed successfully.
- [ ] No new browser console errors.
- [ ] No unnecessary dependencies introduced.
- [ ] Changes remain within the approved scope.
- [ ] Unperformed checks and known limitations documented.

## 17. Version History

| Version | Description |
|---|---|
| 1.0.0 | Initial Modern Orange design system baseline derived from existing ClassHub source code and UI UX Pro Max guidance. |
| 1.1.0 | Approved Academic Monochrome direction with dark sidebar, black primary actions, blue accents, refined neutral colors, and updated component standards. Implementation pending. |
| 1.2.0 | Improved input border contrast from #A1A1AA to #71717A for better form accessibility. |
| 1.3.0 | Updated danger from #DC2626 to #B91C1C to improve normal-text contrast on danger-light. Added danger-hover, on-danger, sidebar-danger, and sidebar-danger-light tokens and standardized destructive button and logout hover colors. Browser verification pending. |
| 1.4.0 | Documented Indonesian language, skip navigation, sidebar active indicators, login semantics, NotFound focus order, task and form dynamic feedback, and required-field semantics. Targeted browser checks reported successful; assistive technology verification remains pending. |

### Research References

UI UX Pro Max color research:

- Portfolio/Personal — Monochrome + Blue Accent.
- SaaS General — Trust Blue.
- Knowledge Base/Documentation — Neutral Grey + Link Blue.

UI UX Pro Max style research:

- Minimalism & Swiss Style.
- Bento Box Grid.
- Executive Dashboard.

These recommendations have been adapted to ClassHub's academic management requirements.

### Audit Limitations

This design system is based on a static review of selected source files, UI UX Pro Max research, and approved visual design decisions.

Not all application pages have been audited.

The Academic Monochrome palette has been implemented in the global design tokens and Sidebar. Migration of the remaining components and pages is in progress.

Selected color combinations have been evaluated conceptually and through contrast calculations, but complete accessibility compliance has not been verified.

Targeted keyboard and browser regression checks for accessibility remediation were reported successful by the developer. Static ARIA changes were reviewed. Full screen reader testing, actual empty assignment and subject states, complete responsive and role-based verification, and WCAG 2.2 AA conformance remain unverified. Initial live-region announcements may vary by assistive technology. Visual required-field indicators, inline validation, inactive password recovery, and disabled/loading readability review remain deferred.

Broader implementation-status and backlog reconciliation is reserved for Step 2.9.7.

This document distinguishes existing implementation patterns from approved target standards and planned improvements.

---

**ClassHub — Academic Monochrome Design System**
