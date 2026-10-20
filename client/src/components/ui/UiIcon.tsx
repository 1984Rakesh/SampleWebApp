// @ds Icon v2026-10-20
import {
  CircleUserRound,
  Plus,
  ChevronRight,
  UserRound,
  Search,
  Moon,
  Sun,
  CircleCheck,
  Trash2,
  Pencil,
  Hourglass,
  List,
  LogOut,
  Menu,
  RotateCcw,
  ListTodo,
  ArrowRight,
  type LucideIcon,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export type UiIconName =
  | 'profile'
  | 'add'
  | 'chevron-right'
  | 'person'
  | 'search'
  | 'theme-dark'
  | 'theme-light'
  | 'check-circle'
  | 'check'
  | 'delete'
  | 'edit'
  | 'hourglass'
  | 'list'
  | 'logout'
  | 'menu'
  | 'undo'
  | 'task'
  | 'arrow-right';

const iconMap: Record<UiIconName, LucideIcon> = {
  profile: CircleUserRound,
  add: Plus,
  'chevron-right': ChevronRight,
  person: UserRound,
  search: Search,
  'theme-dark': Moon,
  'theme-light': Sun,
  'check-circle': CircleCheck,
  check: CircleCheck,
  delete: Trash2,
  edit: Pencil,
  hourglass: Hourglass,
  list: List,
  logout: LogOut,
  menu: Menu,
  undo: RotateCcw,
  task: ListTodo,
  'arrow-right': ArrowRight,
};

interface UiIconProps {
  name: UiIconName;
  size?: 'sm' | 'md';
}

export default function UiIcon({ name, size = 'md' }: UiIconProps) {
  const Icon = iconMap[name];
  return <Icon className={cn(size === 'sm' ? 'size-4' : 'size-5')} aria-hidden="true" />;
}
