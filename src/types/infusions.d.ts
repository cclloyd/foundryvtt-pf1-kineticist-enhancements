import type {ElementString} from "#ke/types/blasts";

export interface FormInfusionConfig {
    id: string;
    name: string;
    type: 'form';
    element: ElementString[];
    blasts: readonly string[];
    prerequisites?: readonly string[];
    level: number | string;
    burn: number | string;
    save?: string | null;
    description: string;
    prepend: boolean;
    append: boolean;
    prependText?: string | null;
    appendText?: string | null;
    noBlastText?: boolean;
    owned?: string;
    transform?: Function | string;
}

export interface SubstanceInfusionConfig {
    id: string;
    name: string;
    type: 'substance';
    element: ElementString[];
    blasts: readonly string[];
    prerequisites?: readonly string[];
    level: number | string;
    burn: number | string;
    save?: string | null;
    description: string;
    prepend: boolean;
    append: boolean;
    prependText?: string | null;
    appendText?: string | null;
    noBlastText?: boolean;
    owned?: string;
    transform?: Function | string;
}

export type InfusionType = 'form' | 'substance';
export type InfusionConfig = FormInfusionConfig | SubstanceInfusionConfig;

export type InfusionConfigs = Record<string, InfusionConfig>;
export type FormInfusionConfigs = Record<string, FormInfusionConfig>;
export type SubstanceInfusionConfigs = Record<string, SubstanceInfusionConfig>;
