import ROUTES from './routes';
import { LayoutDashboard, Pill, Bell, ShieldCheck, LineChart, Users, Settings } from 'lucide-react';

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
  { label: 'Overview',        path: ROUTES.DASHBOARD,                roles: ['Patient', 'Caregiver', 'Doctor'], icon: <LayoutDashboard size={20} /> },
  { label: 'Medications',     path: ROUTES.DASHBOARD_MEDICATIONS,    roles: ['Patient', 'Caregiver'], icon: <Pill size={20} /> },
  { label: 'Reminders',       path: ROUTES.DASHBOARD_REMINDERS,      roles: ['Patient', 'Caregiver'], icon: <Bell size={20} /> },
  { label: 'AI Verification', path: ROUTES.DASHBOARD_AI_VERIFICATION, roles: ['Patient'], icon: <ShieldCheck size={20} /> },
  { label: 'Risk Report',     path: ROUTES.DASHBOARD_RISK_REPORT,    roles: ['Patient', 'Caregiver'], icon: <LineChart size={20} /> },
  { label: 'Caregiver Link',  path: ROUTES.DASHBOARD_CAREGIVER_LINK, roles: ['Patient'], icon: <Users size={20} /> },
  { label: 'Settings',        path: ROUTES.DASHBOARD_SETTINGS,       roles: ['Patient', 'Caregiver', 'Doctor'], icon: <Settings size={20} /> },
];
