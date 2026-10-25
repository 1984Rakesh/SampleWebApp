import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from './dialog';
import { cn } from './utils';

const maxWidthClassMap = {
  xs: 'sm:max-w-md',
  sm: 'sm:max-w-xl',
  md: 'sm:max-w-4xl',
} as const;

interface UiDialogProps {
  open: boolean;
  onClose: () => void;
  title: string;
  description?: React.ReactNode;
  actions?: React.ReactNode;
  maxWidth?: 'xs' | 'sm' | 'md';
  children?: React.ReactNode;
}

export default function UiDialog({
  open,
  onClose,
  title,
  description,
  actions,
  maxWidth = 'xs',
  children,
}: UiDialogProps) {
  return (
    <Dialog open={open} onOpenChange={(next) => { if (!next) onClose(); }}>
      <DialogContent
        className={cn(maxWidthClassMap[maxWidth])}
        {...(description ? {} : { 'aria-describedby': undefined })}
      >
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        {children}
        {actions && <DialogFooter>{actions}</DialogFooter>}
      </DialogContent>
    </Dialog>
  );
}
