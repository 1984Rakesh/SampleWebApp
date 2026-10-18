interface TaskListHeaderProps {
  onCreate: () => void;
}

export default function TaskListHeader({ onCreate }: TaskListHeaderProps) {
  return (
    <header className="flex justify-between items-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tasks</h1>
      <button
        onClick={onCreate}
        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium transition-colors"
      >
        Create Task
      </button>
    </header>
  );
}
