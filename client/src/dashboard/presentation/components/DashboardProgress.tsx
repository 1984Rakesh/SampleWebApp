import type { ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { ChevronRight, List, UserRound } from 'lucide-react';
import type { DashboardStatusLabels, DashboardTaskCounts } from '../models';
import { Card, CardContent, CardHeader, CardTitle, cn } from '../../../components/ui';

interface DashboardProgressProps {
  counts: DashboardTaskCounts;
  statusLabels: DashboardStatusLabels;
  total: number;
  percent: number;
  tasksHref: string;
  profileHref: string;
}

interface LinkCardProps { to: string; icon: ReactNode; iconClassName: string; title: string; description: string }

function LinkCard({ to, icon, iconClassName, title, description }: LinkCardProps) {
  return (
    <Card className="transition-colors hover:bg-accent">
      <Link to={to} className="flex items-center gap-4 rounded-xl px-6 outline-none focus-visible:ring-2 focus-visible:ring-ring">
        <span className={cn('flex size-8 shrink-0 items-center justify-center rounded-[10px]', iconClassName)}>{icon}</span>
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{title}</p>
          <p className="text-sm text-muted-foreground">{description}</p>
        </div>
        <ChevronRight className="size-4 text-muted-foreground" aria-hidden="true" />
      </Link>
    </Card>
  );
}

export default function DashboardProgress({ counts, statusLabels, total, percent, tasksHref, profileHref }: DashboardProgressProps) {
  const legend = [
    { label: statusLabels.completed, swatch: 'bg-chart-1' },
    { label: statusLabels.inProgress, swatch: 'bg-chart-2' },
    { label: statusLabels.todo, swatch: 'bg-chart-3' },
  ] as const;
  const values = [counts.completed, counts.inProgress, counts.todo];
  const barTotal = counts.completed + counts.inProgress + counts.todo || 1;
  return (
    <div className="flex flex-col gap-2">
      <Card>
        <CardHeader>
          <CardTitle className="text-[22px] leading-7 tracking-tight">Overall progress</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4">
            <div className="flex items-baseline gap-2">
              <span className="font-display text-[34px] font-bold tracking-tight">{percent}%</span>
              <span className="text-sm text-muted-foreground">of {total} tasks done</span>
            </div>
            <div className="flex h-2.5 overflow-hidden rounded-full bg-chart-3">
              <div className="bg-chart-1" style={{ width: `${(counts.completed / barTotal) * 100}%` }} />
              <div className="bg-chart-2" style={{ width: `${(counts.inProgress / barTotal) * 100}%` }} />
            </div>
            <div className="flex flex-col gap-1">
              {legend.map((item, index) => (
                <div key={item.label} className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    <span className={cn('mr-1.5 inline-block size-2.5 rounded-sm align-middle', item.swatch)} aria-hidden="true" />
                    {item.label}
                  </span>
                  <span className="text-sm font-semibold">{values[index]}</span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>
      <LinkCard
        to={tasksHref}
        icon={<List className="size-4" aria-hidden="true" />}
        iconClassName="bg-status-progress text-status-progress-foreground"
        title="Manage tasks"
        description="Create, edit and organize"
      />
      <LinkCard
        to={profileHref}
        icon={<UserRound className="size-4" aria-hidden="true" />}
        iconClassName="bg-secondary text-muted-foreground"
        title="Your profile"
        description="Update your details"
      />
    </div>
  );
}
