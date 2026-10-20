// Internal spacing lookup for sealed Ui adapters. MUI spacing units are 8px;
// Tailwind spacing is unit * 4px, so every key maps to twice its value.
// Class names must stay literal so the Tailwind scanner can see them.

const gapMap = { 0: 'gap-0', 0.5: 'gap-1', 0.75: 'gap-1.5', 1: 'gap-2', 1.5: 'gap-3', 2: 'gap-4', 2.5: 'gap-5', 3: 'gap-6', 4: 'gap-8', 5: 'gap-10', 6: 'gap-12', 8: 'gap-16' } as const;
const pMap = { 0: 'p-0', 0.5: 'p-1', 0.75: 'p-1.5', 1: 'p-2', 1.5: 'p-3', 2: 'p-4', 2.5: 'p-5', 3: 'p-6', 4: 'p-8', 5: 'p-10', 6: 'p-12', 8: 'p-16' } as const;
const pxMap = { 0: 'px-0', 0.5: 'px-1', 0.75: 'px-1.5', 1: 'px-2', 1.5: 'px-3', 2: 'px-4', 2.5: 'px-5', 3: 'px-6', 4: 'px-8', 5: 'px-10', 6: 'px-12', 8: 'px-16' } as const;
const pyMap = { 0: 'py-0', 0.5: 'py-1', 0.75: 'py-1.5', 1: 'py-2', 1.5: 'py-3', 2: 'py-4', 2.5: 'py-5', 3: 'py-6', 4: 'py-8', 5: 'py-10', 6: 'py-12', 8: 'py-16' } as const;
const ptMap = { 0: 'pt-0', 0.5: 'pt-1', 0.75: 'pt-1.5', 1: 'pt-2', 1.5: 'pt-3', 2: 'pt-4', 2.5: 'pt-5', 3: 'pt-6', 4: 'pt-8', 5: 'pt-10', 6: 'pt-12', 8: 'pt-16' } as const;
const mtMap = { 0: 'mt-0', 0.5: 'mt-1', 0.75: 'mt-1.5', 1: 'mt-2', 1.5: 'mt-3', 2: 'mt-4', 2.5: 'mt-5', 3: 'mt-6', 4: 'mt-8', 5: 'mt-10', 6: 'mt-12', 8: 'mt-16', auto: 'mt-auto' } as const;
const mbMap = { 0: 'mb-0', 0.5: 'mb-1', 0.75: 'mb-1.5', 1: 'mb-2', 1.5: 'mb-3', 2: 'mb-4', 2.5: 'mb-5', 3: 'mb-6', 4: 'mb-8', 5: 'mb-10', 6: 'mb-12', 8: 'mb-16' } as const;
const mlMap = { 0: 'ml-0', 0.5: 'ml-1', 0.75: 'ml-1.5', 1: 'ml-2', 1.5: 'ml-3', 2: 'ml-4', 2.5: 'ml-5', 3: 'ml-6', 4: 'ml-8', 5: 'ml-10', 6: 'ml-12', 8: 'ml-16' } as const;
const mrMap = { 0: 'mr-0', 0.5: 'mr-1', 0.75: 'mr-1.5', 1: 'mr-2', 1.5: 'mr-3', 2: 'mr-4', 2.5: 'mr-5', 3: 'mr-6', 4: 'mr-8', 5: 'mr-10', 6: 'mr-12', 8: 'mr-16', auto: 'mr-auto' } as const;

type SpacingValue = keyof typeof gapMap;

function pick<T extends Record<PropertyKey, string>>(map: T, value: number | 'auto' | undefined): string | undefined {
  if (value === undefined) return undefined;
  return map[value as keyof T];
}

export const gapClass = (v?: number) => pick(gapMap, v);
export const pClass = (v?: number) => pick(pMap, v);
export const pxClass = (v?: number) => pick(pxMap, v);
export const pyClass = (v?: number) => pick(pyMap, v);
export const ptClass = (v?: number) => pick(ptMap, v);
export const mtClass = (v?: number | 'auto') => pick(mtMap, v);
export const mbClass = (v?: number) => pick(mbMap, v);
export const mlClass = (v?: number) => pick(mlMap, v);
export const mrClass = (v?: number | 'auto') => pick(mrMap, v);
export type { SpacingValue };
