import TextField from '@mui/material/TextField';
import type { TextFieldProps } from '@mui/material/TextField';

export default function UiTextField(props: TextFieldProps) {
  return <TextField fullWidth variant="outlined" {...props} />;
}
