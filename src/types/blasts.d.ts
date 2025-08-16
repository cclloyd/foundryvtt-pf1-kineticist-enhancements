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
    owned?: string;
}

export interface CompositeBlastConfig extends SimpleBlastConfig {
    burn: number | string;
    blasts: readonly string[];
    prerequisites: readonly string[];
    blast1: string;
    blast2: string;
    blast3: string | null;
    transform?: Function | string;
}

export type BlastConfig = SimpleBlastConfig | CompositeBlastConfig;
export type BlastConfigs = Record<string, BlastConfig>;
export type SimpleBlastConfigs = Record<string, SimpleBlastConfig>;
export type CompositeBlastConfigs = Record<string, CompositeBlastConfig>;

type BlastDamageDescription = string;
type BlastDamageValue = string;
export type BlastDamagePart = [BlastDamageValue, BlastDamageDescription];
export type BlastDamageParts = BlastDamagePart[];

export type BlastTransformFunction<TBlastData = any, TFormData = any> = (
    instance: typeof BlastFactory,
    dmgParts: BlastDamageParts,
    blastData: TBlastData,
    blastConfig: BlastConfig,
    formData: TFormData
) => [BlastDamageParts, TBlastData];
