// Type declarations for the utilityTalents3pp module

/** A single Utility Talent entry */


/** Literal ID type for 3pp utility talents (use a union of string literals if you want stricter typing) */
export type UtilityTalentId3pp = string;

/** Map of all 3pp utility talents by ID */
export type UtilityTalents3ppMap = Record<UtilityTalentId3pp, UtilityTalentConfig>;

/** Exported values from the JS/TS module */
export const utilityTalents3pp: UtilityTalents3ppMap;

/** Convenience array factory of all 3pp utility talents */
export function utilityTalents3ppAsArray(): UtilityTalentConfig[];