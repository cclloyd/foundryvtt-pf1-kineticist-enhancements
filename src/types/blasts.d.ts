export type BlastClass = 'simple' | 'composite';
export type BlastType = 'physical' | 'energy' | 'special';

export type DamageTypeString = string;
export type ElementString = string;

export interface SimpleBlastConfig {
    class: BlastClass;
    id: string;
    name: string;
    type: BlastType;
    damageType: readonly DamageTypeString[];
    element: readonly ElementString[];
    description: string;
    icon?: string;
    transform?: Function;
}

export interface CompositeBlastConfig extends SimpleBlastConfig {
    burn: number | string;
    blasts: readonly string[];
    prerequisites: readonly string[];
    blast1: string;
    blast2: string;
    blast3: string | null;
}

export type BlastConfig = SimpleBlastConfig;