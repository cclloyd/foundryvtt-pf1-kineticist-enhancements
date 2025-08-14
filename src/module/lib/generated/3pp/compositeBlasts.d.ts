
/**
 * IDs for composite blasts (3pp set).
 * If you want stricter typing, replace `string` with a union of literal IDs.
 */
export type CompositeBlastId = string;

/** Map of all 3pp composite blasts by ID */
export type CompositeBlasts3ppMap = Record<CompositeBlastId, CompositeBlast>;

/** Exported values from the JS/TS module */
export const compositeBlasts3pp: CompositeBlasts3ppMap;

/** Convenience array factory of composite blasts (optionally including 3pp) */
export function compositeBlastsAsArray(include3pp?: boolean): CompositeBlast[];