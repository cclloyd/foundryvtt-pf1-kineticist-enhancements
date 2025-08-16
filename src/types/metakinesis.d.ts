
export interface MetakinesisConfig {
    id: string;
    name: string;
    burn: number | string;
    description: string;
    transform?: Function | string;
    owned?: string;
    active?: string;
}

export type MetakinesisConfigs = Record<string, MetakinesisConfig>;
