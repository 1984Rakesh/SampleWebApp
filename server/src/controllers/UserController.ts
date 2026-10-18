import { Request, Response } from 'express';

export async function getCurrentUser(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const db = (await import('../database/connection')).default;
    const user = db.prepare('SELECT id, name, email, avatar, bio, created_at FROM users WHERE id = ?').get(userId) as any;

    if (!user) {
      res.status(404).json({ error: 'User not found' });
      return;
    }

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.created_at,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch user' });
  }
}

export async function updateProfile(req: Request, res: Response): Promise<void> {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ error: 'Unauthorized' });
      return;
    }

    const { name, bio, avatar } = req.body;

    const db = (await import('../database/connection')).default;
    const updateUser = db.prepare(`
      UPDATE users
      SET name = COALESCE(?, name),
          bio = COALESCE(?, bio),
          avatar = COALESCE(?, avatar)
      WHERE id = ?
    `);

    updateUser.run(name, bio, avatar, userId);

    // Fetch updated user
    const user = db.prepare('SELECT id, name, email, avatar, bio, created_at FROM users WHERE id = ?').get(userId) as any;

    res.json({
      id: user.id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      bio: user.bio,
      createdAt: user.created_at,
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to update profile' });
  }
}
