/**
 * COLOR USAGE GUIDE
 * 
 * This guide shows how to use the centralized color constants throughout the application.
 * Always import from constants/colors.ts instead of hardcoding color values.
 */

// ============================================================================
// 1. IMPORT THE COLORS
// ============================================================================
import { COLORS, COMPONENT_STYLES, STATUS_BADGE_COLORS } from "@/constants/colors";

// ============================================================================
// 2. USING COLORS FOR BACKGROUNDS
// ============================================================================

// Before (Bad - Hardcoded):
// <div className="bg-teal-600">Content</div>

// After (Good - Using Constants):
// <div className={`bg-${COLORS.PRIMARY[600]}`}>Content</div>

// Better - Using Gradient:
// <div className={COLORS.GRADIENT.PRIMARY_BUTTON}>Content</div>

// ============================================================================
// 3. USING COLORS FOR TEXT
// ============================================================================

// Muted text
// <p className={`text-${COLORS.TEXT.muted}`}>Muted text</p>

// Primary text
// <p className={`${COLORS.TEXT.primary}`}>Primary text</p>

// ============================================================================
// 4. USING COMPONENT_STYLES FOR COMMON PATTERNS
// ============================================================================

// Card with consistent styling:
/*
<div className={COMPONENT_STYLES.CARD.base}>
  <div className={COMPONENT_STYLES.CARD.hover}>
    Card content
  </div>
</div>
*/

// Button with consistent styling:
/*
<button className={COMPONENT_STYLES.BUTTON.primary}>
  Save Changes
</button>

<button className={COMPONENT_STYLES.BUTTON.secondary}>
  Cancel
</button>

<button className={COMPONENT_STYLES.BUTTON.ghost}>
  Skip
</button>
*/

// Input with consistent styling:
/*
<input
  className={`${COMPONENT_STYLES.INPUT.base} ${COMPONENT_STYLES.INPUT.focus}`}
  placeholder="Enter text..."
/>

<input
  disabled
  className={`${COMPONENT_STYLES.INPUT.base} ${COMPONENT_STYLES.INPUT.disabled}`}
/>
*/

// ============================================================================
// 5. USING BADGE STYLES
// ============================================================================

// Status badges:
/*
<div className={COMPONENT_STYLES.BADGE.success}>Approved</div>
<div className={COMPONENT_STYLES.BADGE.warning}>Pending</div>
<div className={COMPONENT_STYLES.BADGE.info}>In Review</div>
<div className={COMPONENT_STYLES.BADGE.error}>Rejected</div>
*/

// ============================================================================
// 6. USING STATUS COLOR MAPPING
// ============================================================================

// Map status string to colors:
/*
const status = "approved";
const colors = STATUS_BADGE_COLORS[status];

<div className={`bg-${colors.bg} text-${colors.text}`}>
  {status}
</div>
*/

// ============================================================================
// 7. USING FOCUS STYLES
// ============================================================================

// Input with focus ring:
/*
<input
  className={`border border-gray-300 rounded-lg px-4 py-2 ${COLORS.FOCUS.primary}`}
  placeholder="Focus me"
/>
*/

// ============================================================================
// 8. USING NEUTRAL COLORS FOR HIERARCHY
// ============================================================================

// Primary heading:
/*
<h1 className={`text-3xl font-bold ${COLORS.TEXT.primary}`}>
  Main Title
</h1>
*/

// Secondary heading:
/*
<h2 className={`text-2xl font-semibold ${COLORS.TEXT.secondary}`}>
  Sub Title
</h2>
*/

// Muted text:
/*
<p className={`text-sm ${COLORS.TEXT.muted}`}>
  Helper text
</p>
*/

// ============================================================================
// 9. USING BORDERS CONSISTENTLY
// ============================================================================

// Light border (subtle):
/*
<div className={`border ${COLORS.BORDER.light}`}>
  Content
</div>
*/

// Default border:
/*
<div className={`border ${COLORS.BORDER.default}`}>
  Content
</div>
*/

// ============================================================================
// 10. USING SHADOWS CONSISTENTLY
// ============================================================================

// Small shadow:
/*
<div className={`${COLORS.SHADOW.sm}`}>Card</div>
*/

// Medium shadow (default):
/*
<div className={`${COLORS.SHADOW.md}`}>Card</div>
*/

// Large shadow (hover):
/*
<div className={`${COLORS.SHADOW.lg}`}>Card</div>
*/

// ============================================================================
// SUMMARY OF BENEFITS
// ============================================================================

/*
1. CONSISTENCY - All components use the same colors
2. MAINTAINABILITY - Change colors in one place, affects entire app
3. REUSABILITY - Use pre-built component styles (COMPONENT_STYLES)
4. SCALABILITY - Easy to add new colors or modify existing ones
5. ACCESSIBILITY - Colors are tested and accessible
6. DESIGN SYSTEM - Follows design system principles

MIGRATION CHECKLIST:
☐ Replace all hardcoded bg-teal-* with COLORS.PRIMARY
☐ Replace all hardcoded text-* with COLORS.TEXT
☐ Replace all hardcoded border-* with COLORS.BORDER
☐ Replace all hardcoded shadow-* with COLORS.SHADOW
☐ Replace button className combinations with COMPONENT_STYLES.BUTTON.*
☐ Replace input className combinations with COMPONENT_STYLES.INPUT.*
☐ Replace card className combinations with COMPONENT_STYLES.CARD.*
☐ Replace badge className combinations with COMPONENT_STYLES.BADGE.*
☐ Replace status colors with STATUS_BADGE_COLORS
*/
