/// <reference types="fvtt-types" />
export {};

declare global {
  namespace ClientSettings {
    interface Values {
      "pf1-kineticist-enhancements": {
        // Keep an index signature, but we’ll narrow at usage sites
        [key: string]: unknown;

        // Known keys for better hints
        customBlasts: Record<string, unknown>;
        customFormInfusions: Record<string, unknown>;
        customSubstanceInfusions: Record<string, unknown>;
        customMetakinesis: Record<string, unknown>;
        customUtilityTalents: Record<string, unknown>;
        customFeats: Record<string, unknown>;
      };
    }
  }

  // Add namespace-specific overloads instead of generic ones.
  // This avoids the conflict with the "core" overloads in fvtt-types.
  interface ClientSettings {
    get(namespace: "pf1-kineticist-enhancements", key: string): unknown;
    set(namespace: "pf1-kineticist-enhancements", key: string, value: unknown): Promise<unknown>;
  }
}