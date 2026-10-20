// @ds TaskProgress v2026-10-20
interface UiProgressProps {
  completed: number;
  inProgress: number;
  todo: number;
}

export default function UiProgress({ completed, inProgress, todo }: UiProgressProps) {
  const total = completed + inProgress + todo || 1;
  return (
    <div className="flex h-2.5 overflow-hidden rounded-full bg-chart-3">
      <div className="bg-chart-1" style={{ width: `${(completed / total) * 100}%` }} />
      <div className="bg-chart-2" style={{ width: `${(inProgress / total) * 100}%` }} />
    </div>
  );
}
