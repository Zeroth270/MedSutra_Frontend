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
  { label: 'Overview',        path: ROUTES.DASHBOARD,                roles: ['Patient', 'Caregiver', 'Doctor'], icon: '📊' },
  { label: 'Medications',     path: ROUTES.DASHBOARD_MEDICATIONS,    roles: ['Patient', 'Caregiver'], icon: '💊' },
  { label: 'Reminders',       path: ROUTES.DASHBOARD_REMINDERS,      roles: ['Patient', 'Caregiver'], icon: '⏰' },
  { label: 'AI Verification', path: ROUTES.DASHBOARD_AI_VERIFICATION, roles: ['Patient'], icon: '🛡️' },
  { label: 'Risk Report',     path: ROUTES.DASHBOARD_RISK_REPORT,    roles: ['Patient', 'Caregiver'], icon: '📈' },
  { label: 'Caregiver Link',  path: ROUTES.DASHBOARD_CAREGIVER_LINK, roles: ['Patient'], icon: '🤝' },
  { label: 'Settings',        path: ROUTES.DASHBOARD_SETTINGS,       roles: ['Patient', 'Caregiver', 'Doctor'], icon: '⚙️' },
];
