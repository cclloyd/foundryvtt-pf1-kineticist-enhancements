export interface FeatConfig {
    id: string;
    name: string;
    benefit: string;
    prerequisites?: readonly string[];
    transform?: Function | string;
    owned?: string;
    forced?: boolean;
    burn?: string;
    icon?: string;
}

export type FeatConfigs = Record<string, FeatConfig>;
