import AccountCircleIcon from '@mui/icons-material/AccountCircle';
import AddIcon from '@mui/icons-material/Add';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import PersonOutlineIcon from '@mui/icons-material/PersonOutline';
import SearchIcon from '@mui/icons-material/Search';
import Brightness4Icon from '@mui/icons-material/Brightness4';
import Brightness7Icon from '@mui/icons-material/Brightness7';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import DeleteOutlineIcon from '@mui/icons-material/DeleteOutline';
import EditOutlinedIcon from '@mui/icons-material/EditOutlined';
import HourglassEmptyIcon from '@mui/icons-material/HourglassEmpty';
import ListAltIcon from '@mui/icons-material/ListAlt';
import LogoutIcon from '@mui/icons-material/Logout';
import MenuIcon from '@mui/icons-material/Menu';
import ReplayIcon from '@mui/icons-material/Replay';
import TaskIcon from '@mui/icons-material/Task';

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
  | 'task';

const iconMap: Record<UiIconName, React.ComponentType<{ fontSize?: 'small' | 'medium' }>> = {
  profile: AccountCircleIcon,
  add: AddIcon,
  'chevron-right': ChevronRightIcon,
  person: PersonOutlineIcon,
  search: SearchIcon,
  'theme-dark': Brightness4Icon,
  'theme-light': Brightness7Icon,
  'check-circle': CheckCircleIcon,
  check: CheckCircleOutlineIcon,
  delete: DeleteOutlineIcon,
  edit: EditOutlinedIcon,
  hourglass: HourglassEmptyIcon,
  list: ListAltIcon,
  logout: LogoutIcon,
  menu: MenuIcon,
  undo: ReplayIcon,
  task: TaskIcon,
};

interface UiIconProps {
  name: UiIconName;
  size?: 'sm' | 'md';
}

export default function UiIcon({ name, size = 'md' }: UiIconProps) {
  const Icon = iconMap[name];
  return <Icon fontSize={size === 'sm' ? 'small' : 'medium'} />;
}
