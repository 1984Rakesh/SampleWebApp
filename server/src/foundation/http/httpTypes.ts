import type { RequestHandler, Router } from 'express';

/** Framework-neutral names for the HTTP pieces feature assemblies hand to App. */
export type HttpRouter = Router;
export type HttpMiddleware = RequestHandler;
