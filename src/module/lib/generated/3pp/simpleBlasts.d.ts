import type { SimpleBlastConfig } from "../../../../types/blasts";

/** Literal IDs available in the 3pp set */
export type SimpleBlastIds3pp =
  | 'bone'
  | 'chrono'
  | 'light'
  | 'poison'
  | 'sonic'
  | 'vibration';

/** Map of all 3pp simple blasts by ID */
export type SimpleBlasts3ppMap = Record<SimpleBlastIds3pp, SimpleBlastConfig>;

/** Exported values from the JS module */
export const simpleBlasts3pp: SimpleBlasts3ppMap;

/** Convenience array factory of all 3pp simple blasts */
export function simpleBlasts3ppAsArray(): SimpleBlastConfig[];