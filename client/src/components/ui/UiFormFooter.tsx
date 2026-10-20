interface UiFormFooterProps {
  children: React.ReactNode;
}

// Dialog/form action row: stacked reversed on narrow screens, right-aligned row from sm.
export default function UiFormFooter({ children }: UiFormFooterProps) {
  return <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">{children}</div>;
}
