/**
 * Centralized Color Constants for Reusability
 * All colors used across components should reference this file for consistency
 */

export const COLORS = {
  // Primary Colors (Teal - Main Brand Color)
  PRIMARY: {
    50: "teal-50",
    100: "teal-100",
    300: "teal-300",
    500: "teal-500",
    600: "teal-600",
    700: "teal-700",
    800: "teal-800",
  },

  // Secondary Colors (Indigo/Purple - Headers & Accents)
  SECONDARY: {
    50: "indigo-50",
    100: "indigo-100",
    600: "indigo-600",
    700: "indigo-700",
  },

  // Status Colors
  STATUS: {
    // Approved/Success
    SUCCESS: {
      bg: "green-100",
      text: "green-800",
      border: "green-300",
      dark: "green-600",
    },
    // Pending/Warning
    WARNING: {
      bg: "amber-100",
      text: "amber-800",
      border: "amber-300",
      dark: "amber-600",
      light: "amber-50",
    },
    // In Review/Info
    INFO: {
      bg: "purple-100",
      text: "purple-800",
      border: "purple-300",
      dark: "purple-600",
    },
    // Alert/Error
    ERROR: {
      bg: "red-100",
      text: "red-800",
      border: "red-300",
    },
  },

  // Neutral Colors (Grayscale)
  NEUTRAL: {
    50: "gray-50",
    100: "gray-100",
    200: "gray-200",
    300: "gray-300",
    400: "gray-400",
    500: "gray-500",
    600: "gray-600",
    700: "gray-700",
    800: "gray-800",
    900: "gray-900",
    white: "white",
  },

  // Gradient Combinations
  GRADIENT: {
    // Primary gradient
    PRIMARY_BUTTON:
      "bg-gradient-to-r from-teal-600 to-teal-700 hover:from-teal-700 hover:to-teal-800",
    PRIMARY_BUTTON_LIGHT:
      "bg-gradient-to-r from-teal-600 to-blue-600 hover:from-teal-700 hover:to-blue-700",

    // Header gradients
    HEADER_MANAGER:
      "bg-gradient-to-br from-purple-600 to-indigo-600 text-white",
    HEADER_EMPLOYEE:
      "bg-gradient-to-br from-teal-600 to-teal-700 text-white",
    HEADER_LIGHT: "bg-gradient-to-r from-teal-50 to-teal-100",
  },

  // Border Colors
  BORDER: {
    light: "border-gray-100",
    default: "border-gray-200",
    medium: "border-gray-300",
    dark: "border-gray-400",
  },

  // Background Colors
  BG: {
    primary: "bg-white",
    secondary: "bg-gray-50",
    tertiary: "bg-gray-100",
    light: "bg-teal-50",
    lightPurple: "bg-purple-50",
    lightAmber: "bg-amber-50",
  },

  // Text Colors
  TEXT: {
    primary: "text-gray-900",
    secondary: "text-gray-700",
    muted: "text-gray-500",
    light: "text-gray-400",
    white: "text-white",
    teal: "text-teal-600",
  },

  // Shadow Classes
  SHADOW: {
    sm: "shadow-sm",
    md: "shadow-md",
    lg: "shadow-lg",
    none: "shadow-none",
  },

  // Focus Ring Colors
  FOCUS: {
    primary: "focus:ring-2 focus:ring-teal-500 focus:border-teal-500",
    secondary: "focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500",
  },
};

/**
 * Common Component Color Patterns (Ready-to-Use Classes)
 */
export const COMPONENT_STYLES = {
  // Card styles
  CARD: {
    base: `${COLORS.BG.primary} rounded-2xl ${COLORS.SHADOW.md} ${COLORS.BORDER.light} border overflow-hidden`,
    hover: `hover:${COLORS.SHADOW.lg} transition-shadow`,
  },

  // Button styles
  BUTTON: {
    primary: `${COLORS.GRADIENT.PRIMARY_BUTTON} ${COLORS.TEXT.white} font-semibold transition-all shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed`,
    secondary: `${COLORS.BG.secondary} ${COLORS.TEXT.secondary} font-semibold border ${COLORS.BORDER.default} hover:${COLORS.BG.tertiary} transition-colors disabled:opacity-50`,
    ghost: `${COLORS.TEXT.secondary} hover:${COLORS.BG.secondary} transition-colors disabled:opacity-50`,
  },

  // Input styles
  INPUT: {
    base: `w-full px-4 py-2.5 border ${COLORS.BORDER.default} rounded-lg ${COLORS.BG.primary} ${COLORS.TEXT.primary} placeholder-gray-400 transition-shadow`,
    focus: `${COLORS.FOCUS.primary}`,
    disabled: `${COLORS.BG.secondary} ${COLORS.TEXT.light} cursor-not-allowed`,
  },

  // Badge/Label styles
  BADGE: {
    success: `px-3 py-1.5 rounded-lg ${COLORS.STATUS.SUCCESS.bg} ${COLORS.STATUS.SUCCESS.text} text-sm font-semibold`,
    warning: `px-3 py-1.5 rounded-lg ${COLORS.STATUS.WARNING.bg} ${COLORS.STATUS.WARNING.text} text-sm font-semibold`,
    info: `px-3 py-1.5 rounded-lg ${COLORS.STATUS.INFO.bg} ${COLORS.STATUS.INFO.text} text-sm font-semibold`,
    error: `px-3 py-1.5 rounded-lg ${COLORS.STATUS.ERROR.bg} ${COLORS.STATUS.ERROR.text} text-sm font-semibold`,
  },

  // Header styles
  HEADER: {
    manager: `${COLORS.GRADIENT.HEADER_MANAGER} rounded-2xl ${COLORS.SHADOW.lg} p-6`,
    employee: `${COLORS.GRADIENT.HEADER_EMPLOYEE} rounded-2xl ${COLORS.SHADOW.lg} p-6`,
  },

  // Table styles
  TABLE: {
    headerBg: COLORS.GRADIENT.HEADER_LIGHT,
    headerText: COLORS.TEXT.secondary,
    rowHover: "hover:bg-teal-50/50 transition-colors",
  },

  // Link styles
  LINK: {
    primary: `${COLORS.TEXT.teal} hover:underline transition-colors`,
    muted: `${COLORS.TEXT.muted} hover:${COLORS.TEXT.secondary} transition-colors`,
  },
};

/**
 * Status Badge Mapper - Maps status strings to badge styles
 */
export const STATUS_BADGE_COLORS = {
  approved: COLORS.STATUS.SUCCESS,
  submitted: COLORS.STATUS.WARNING,
  "in-review": COLORS.STATUS.INFO,
  pending: COLORS.STATUS.WARNING,
  rejected: COLORS.STATUS.ERROR,
};

export default COLORS;
