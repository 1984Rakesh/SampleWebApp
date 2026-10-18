import { Request, Response, NextFunction } from 'express';

export function errorMiddleware(
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  console.error('Error:', error);

  if (error.message.includes('UNIQUE constraint')) {
    res.status(409).json({ error: 'Resource already exists' });
    return;
  }

  if (error.message.includes('FOREIGN KEY constraint')) {
    res.status(400).json({ error: 'Invalid reference' });
    return;
  }

  if (error.message.includes('Invalid or expired token')) {
    res.status(401).json({ error: error.message });
    return;
  }

  res.status(500).json({ error: 'Internal server error' });
}
