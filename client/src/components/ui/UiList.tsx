interface UiListProps {
  children: React.ReactNode;
}

export default function UiList({ children }: UiListProps) {
  return <ul className="m-0 pl-4">{children}</ul>;
}
