import db from './connection';
import bcrypt from 'bcrypt';

export function seedDatabase(): void {
  // Check if data already exists
  const userCount = db.prepare('SELECT COUNT(*) as count FROM users').get() as { count: number };
  if (userCount.count > 0) {
    console.log('Database already seeded');
    return;
  }

  // Hash password for demo user
  const passwordHash = bcrypt.hashSync('password123', 10);

  // Insert demo user
  const userId = 'user-1';
  const insertUser = db.prepare(`
    INSERT INTO users (id, name, email, password_hash, avatar, bio)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  insertUser.run(
    userId,
    'Demo User',
    'demo@example.com',
    passwordHash,
    'https://api.dicebear.com/7.x/avataaars/svg?seed=demo',
    'iOS developer learning web architecture'
  );

  // Insert demo tasks
  const tasks = [
    {
      id: 'task-1',
      title: 'Learn Clean Architecture',
      description: 'Understand the principles of Clean Architecture',
      status: 'COMPLETED',
      priority: 'HIGH',
      due_date: new Date(Date.now() - 86400000).toISOString(),
      user_id: userId,
    },
    {
      id: 'task-2',
      title: 'Setup React project',
      description: 'Initialize Vite + TypeScript + Tailwind',
      status: 'IN_PROGRESS',
      priority: 'HIGH',
      due_date: new Date(Date.now() + 86400000).toISOString(),
      user_id: userId,
    },
    {
      id: 'task-3',
      title: 'Implement domain layer',
      description: 'Create domain models and use cases',
      status: 'TODO',
      priority: 'MEDIUM',
      due_date: new Date(Date.now() + 172800000).toISOString(),
      user_id: userId,
    },
    {
      id: 'task-4',
      title: 'Build comparison UI',
      description: 'Create iOS vs Web comparison dashboard',
      status: 'TODO',
      priority: 'LOW',
      due_date: new Date(Date.now() + 259200000).toISOString(),
      user_id: userId,
    },
  ];

  const insertTask = db.prepare(`
    INSERT INTO tasks (id, title, description, status, priority, due_date, user_id)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `);

  const insertMany = db.transaction((tasks: any[]) => {
    for (const task of tasks) {
      insertTask.run(
        task.id,
        task.title,
        task.description,
        task.status,
        task.priority,
        task.due_date,
        task.user_id
      );
    }
  });

  insertMany(tasks);

  console.log('Database seeded successfully');
}
