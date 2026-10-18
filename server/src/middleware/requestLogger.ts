import { NextFunction, Request, Response } from 'express';

const sensitiveKeys = new Set([
  'password',
  'passwordhash',
  'token',
  'accesstoken',
  'refreshtoken',
  'authorization',
]);

function sanitize(value: unknown): unknown {
  if (Array.isArray(value)) {
    return value.map(sanitize);
  }

  if (value && typeof value === 'object') {
    return Object.fromEntries(
      Object.entries(value).map(([key, nestedValue]) => {
        const normalizedKey = key.toLowerCase().replace(/[^a-z]/g, '');
        return [key, sensitiveKeys.has(normalizedKey) ? '[REDACTED]' : sanitize(nestedValue)];
      })
    );
  }

  return value;
}

export function requestLogger(req: Request, res: Response, next: NextFunction): void {
  const startedAt = Date.now();
  let responseBody: unknown;
  const originalJson = res.json.bind(res);

  res.json = ((body: unknown) => {
    responseBody = body;
    return originalJson(body);
  }) as Response['json'];

  console.log('[API Request]', {
    method: req.method,
    url: req.originalUrl,
    body: sanitize(req.body),
  });

  res.on('finish', () => {
    console.log('[API Response]', {
      method: req.method,
      url: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - startedAt,
      body: sanitize(responseBody),
    });
  });

  next();
}
