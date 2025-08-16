export interface KineticistActorConfig {
    simple: string[],
    composite: string[],
    form: string[],
    substance: string[],
    utility: string[],
    feats: string[],
    mythicFeats: string[],
    metakinesis: string[],
    autofeats: boolean,
    [key: string]: any;
}

export interface BlastAttackFormRemember {
    remember: boolean;
    value?: string | string[];
}

export interface ActorBlastAttackFormRemember {
    gather: BlastAttackFormRemember;
    blast: BlastAttackFormRemember;
    form: BlastAttackFormRemember;
    substance: BlastAttackFormRemember;
    metakinesis: BlastAttackFormRemember;
    utility: BlastAttackFormRemember;
    burn: BlastAttackFormRemember;
    skipMeasure: BlastAttackFormRemember;
}

export interface KineticistActorFlags {
    actorConfig: KineticistActorConfig;
    rememberBlastAttack: ActorBlastAttackFormRemember;
}
