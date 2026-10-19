import SearchIcon from '@mui/icons-material/Search';
import InputAdornment from '@mui/material/InputAdornment';
import TextField from '@mui/material/TextField';

interface UiSearchFieldProps { value: string; onChange: (value: string) => void; placeholder: string }

export default function UiSearchField({ value, onChange, placeholder }: UiSearchFieldProps) {
  return <TextField fullWidth size="small" value={value} onChange={(event) => onChange(event.target.value)} placeholder={placeholder} aria-label={placeholder} slotProps={{ input: { startAdornment: <InputAdornment position="start"><SearchIcon fontSize="small" /></InputAdornment> } }} />;
}
