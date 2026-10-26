import { useState } from 'react';
import { OctagonX } from 'lucide-react';
import { LoadingSpinner } from '../../../components/feedback';
import { Alert, AlertDescription, Button, Card } from '../../../components/ui';
import TaskTable from './taskList/TaskTable';
import DeleteTaskDialog from './taskList/DeleteTaskDialog';
import type { TaskItemViewState } from '../models';

interface TaskListContentProps { tasks: TaskItemViewState[]; total: number; isLoading: boolean; errorMessage?: string; onEdit: (id: string) => void; onDelete: (id: string) => void; onToggleStatus: (id: string) => void }

export default function TaskListContent({ tasks, isLoading, errorMessage, onEdit, onDelete, onToggleStatus }: TaskListContentProps) {
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [page, setPage] = useState(0);
  const rowsPerPage = 8;
  const lastPage = Math.max(0, Math.ceil(tasks.length / rowsPerPage) - 1);
  const visiblePage = Math.min(page, lastPage);
  const visibleTasks = tasks.slice(visiblePage * rowsPerPage, visiblePage * rowsPerPage + rowsPerPage);
  const confirmDelete = () => { if (deleteId) { onDelete(deleteId); setDeleteId(null); } };
  if (isLoading) return <div className="flex justify-center py-12"><LoadingSpinner size="lg" text="Loading tasks..." /></div>;
  if (errorMessage) return <Alert variant="destructive" className="mb-4"><OctagonX /><AlertDescription>Error loading tasks: {errorMessage}</AlertDescription></Alert>;
  if (tasks.length === 0) return <Card><p className="py-12 text-center text-muted-foreground">No tasks match these filters.</p></Card>;
  const shown = visibleTasks.length;
  return (
    <>
      <TaskTable tasks={visibleTasks} onEdit={onEdit} onDelete={setDeleteId} onToggleStatus={onToggleStatus} footer={<><span>Showing {shown} of {tasks.length} tasks</span><div className="flex gap-2"><Button type="button" variant="outline" size="sm" disabled={visiblePage === 0} onClick={() => setPage((value) => value - 1)}>Previous</Button><Button type="button" variant="outline" size="sm" disabled={visiblePage >= lastPage} onClick={() => setPage((value) => value + 1)}>Next</Button></div></>} />
      <DeleteTaskDialog open={!!deleteId} onCancel={() => setDeleteId(null)} onConfirm={confirmDelete} />
    </>
  );
}
