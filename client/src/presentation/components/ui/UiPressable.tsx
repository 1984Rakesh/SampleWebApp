import ButtonBase from '@mui/material/ButtonBase';

interface UiPressableProps {
  children: React.ReactNode;
  onClick?: () => void;
  selected?: boolean;
}

export default function UiPressable({ children, onClick, selected = false }: UiPressableProps) {
  return (
    <ButtonBase
      onClick={onClick}
      sx={{
        width: '100%',
        textAlign: 'left',
        borderRadius: 2,
        p: 1,
        display: 'block',
        outline: selected ? '2px solid' : 'none',
        outlineColor: 'primary.main',
        outlineOffset: 2,
      }}
    >
      {children}
    </ButtonBase>
  );
}
