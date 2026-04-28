import ROUTES from './routes';

/**
 * Public header navigation links.
 */
export const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'About', href: '/#about' },
  { label: 'Features', href: '/#features' },
];

/**
 * Dashboard sidebar navigation items.
 */
export const DASHBOARD_NAV = [
  { label: 'Overview',        path: ROUTES.DASHBOARD },
  { label: 'Medications',     path: ROUTES.DASHBOARD_MEDICATIONS },
  { label: 'Reminders',       path: ROUTES.DASHBOARD_REMINDERS },
  { label: 'AI Verification', path: ROUTES.DASHBOARD_AI_VERIFICATION },
  { label: 'Risk Report',     path: ROUTES.DASHBOARD_RISK_REPORT },
  { label: 'Caregiver Link',  path: ROUTES.DASHBOARD_CAREGIVER_LINK },
  { label: 'Settings',        path: ROUTES.DASHBOARD_SETTINGS },
];
