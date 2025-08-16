/* eslint-disable no-unused-vars */
import type {BlastConfig, BlastDamageParts} from '#ke/types/blasts';
import type BlastFactory from "#ke/module/lib/factory";

export const utilityTransforms = {
    'aetheric-boost': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        // TODO: Add working boost here
        blastData.system.attackNotes.push(`Aetheric Boost`);
        return [dmgParts, blastData];
    },
    'airs-reach': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        // If air is an element in the blastConfig
        if (blastConfig.element.indexOf('air') > -1) {
            if (blastData.system.actions[0].actionType !== 'mwak') {
                blastData.system.attackNotes.push(`Air's Reach`);
                blastData.system.actions[0].range.value = `${parseInt(blastData.system.actions[0].range.value) * 2}`;
            }
        }
        return [dmgParts, blastData];
    },
    'push-special': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.attackNotes.push(`Special Push Blast`);
        blastData.name = `Forceful ${blastData.name}`.replace('Blast', 'Push');
        blastData.system.actions[0].range.value = 60;
        dmgParts[0][0] = `(@classes.kineticist.level )d6`;
        return [dmgParts, blastData];
    },
    'double-damage': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        dmgParts.forEach((part, index) => {
            dmgParts[index][0] = `(${part[0]})*2`;
        });
        return [dmgParts, blastData];
    },
    'half-damage': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        dmgParts.forEach((part, index) => {
            dmgParts[index][0] = `(${part[0]})/2`;
        });
        return [dmgParts, blastData];
    },
    'double-area': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.actions[0].measureTemplate.size =
            parseInt(blastData.system.actions[0].measureTemplate.size) * 2;
    },
    'half-area': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.actions[0].measureTemplate.size =
            Math.floor(parseInt(blastData.system.actions[0].measureTemplate.size) / 2 / 5) * 5;
    },
};
