import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import type { DashboardTaskItem } from '../models';
import { ChecklistRow } from '../../../components/app';
import { Button, Card, CardAction, CardHeader, CardTitle } from '../../../components/ui';

interface DashboardRecentTasksProps { tasks: DashboardTaskItem[]; tasksHref: string; onToggle: (id: string) => void }

export default function DashboardRecentTasks({ tasks, tasksHref, onToggle }: DashboardRecentTasksProps) {
  return (
    <Card className="gap-0 overflow-hidden py-0">
      <CardHeader className="items-center pt-5 pb-3">
        <CardTitle className="text-[22px] leading-7 tracking-tight">Recent tasks</CardTitle>
        <CardAction>
          <Button asChild variant="link" size="sm" className="h-auto px-0">
            <Link to={tasksHref}>
              View all
              <ArrowRight className="size-4" aria-hidden="true" />
            </Link>
          </Button>
        </CardAction>
      </CardHeader>
      {tasks.length === 0 ? (
        <div className="px-6 pb-6"><p className="text-sm text-muted-foreground">No tasks yet. Create your first task.</p></div>
      ) : tasks.map((task, index) => (
        <ChecklistRow
          key={task.id}
          title={task.title}
          description={task.description}
          checked={task.isCompleted}
          toggleAriaLabel={task.toggleAriaLabel}
          chips={[
            { label: task.statusLabel, variant: task.statusVariant },
            { label: task.priorityLabel, variant: task.priorityVariant },
          ]}
          meta={task.dueDateLabel}
          metaTone={task.dueDateTone === 'amber' ? 'warning' : 'muted'}
          divider={index > 0}
          onToggle={() => onToggle(task.id)}
        />
      ))}
    </Card>
  );
}
