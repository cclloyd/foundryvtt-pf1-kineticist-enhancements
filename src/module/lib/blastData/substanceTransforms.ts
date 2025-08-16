/* eslint-disable no-unused-vars */

import {save} from './blastTemplates';
import type {BlastDamageParts} from '#ke/types/blasts';
import type {BlastConfig} from '#ke/types/blasts';
import type BlastFactory from "#ke/module/lib/factory";

export const substanceTransforms = {
    blocking: (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        save(blastData, 'fort', 'partial');
        return [dmgParts, blastData];
    },
    bowling: (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        save(blastData, 'fort', 'partial');
        return [dmgParts, blastData];
    },
    synaptic: (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        save(blastData, 'will');
        return [dmgParts, blastData];
    },
    thundering: (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        save(blastData, 'fort');
        return [dmgParts, blastData];
    },
};
