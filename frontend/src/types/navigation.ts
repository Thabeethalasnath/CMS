import { LucideIcon } from 'lucide-react';

export interface NavItem {
  id: string;
  label: string;
  path: string;
  icon: LucideIcon;
  badge?: string | number;
}

export interface NavSection {
  id: string;
  title: string;
  icon: LucideIcon;
  items: NavItem[];
  variant?: 'default' | 'management';
  defaultExpanded?: boolean;
}
