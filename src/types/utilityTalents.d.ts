
export interface UtilityTalentConfig {
    id: string;
    name: string;
    description: string;
    priority?: number;
    element: readonly string[];
    level: string;
    type: string;
    burn: string;
    prerequisites: readonly string[];
    save?: string;
    sr?: string;
}
