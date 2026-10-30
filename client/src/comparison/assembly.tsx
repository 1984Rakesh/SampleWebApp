import { lazy } from 'react';
import { ComparisonRoute, type ComparisonFeature } from './presentation/contracts';

/** Builds the comparison feature; it needs no cross-feature dependencies (shared §10). */
export function createComparisonFeature(): ComparisonFeature {
  const ComparisonScreen = lazy(() => import('./presentation/screens').then((m) => ({ default: m.ComparisonScreen })));
  return { routes: [{ path: ComparisonRoute.comparison, element: <ComparisonScreen /> }] };
}
