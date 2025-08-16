/* eslint-disable no-unused-vars */
import {appendBaseName, divideDamage, measure, melee, save} from './blastTemplates';
import type {BlastConfig, BlastDamagePart, BlastDamageParts, BlastTransformFunction} from "#ke/types/blasts";
import type BlastFactory from "#ke/module/lib/factory";

export const formTransforms: Record<string, BlastTransformFunction> = {
    'blade-rush': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.actions[0].range.value = '5';
        return [dmgParts, blastData];
    },
    'blade-rush-whip': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.actions[0].range.value = '15';
        return [dmgParts, blastData];
    },
    'blade-whirlwind': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.actions[0].range.value = '5';
        return [dmgParts, blastData];
    },
    chain: (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        // TODO: Add decreasing damage
        blastData.system.actions[0].formulaicAttacks = {
            count: { formula: 'ceil(@classes.kineticist.level / 2)' },
            bonus: { formula: '0' },
            label: 'Attack #{0}',
        };
        return [dmgParts, blastData];
    },
    cloud: (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        // TODO: Add measure templates.  Override texture to be cloud w/ lightning
        blastData.system.effectNotes.push(`Cloud Infusion`);
        blastData.system.actions[0].actionType = 'save';
        blastData.system.actions[0].spellArea = '20-ft. radius';
        blastData.system.actions[0].range.value = '120';
        blastData.system.actions[0].measureTemplate = measure(20);
        save(blastData, 'ref');
        divideDamage(dmgParts, 2);
        appendBaseName(dmgParts, 'Cloud');
        return [dmgParts, blastData];
    },
    cyclone: (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.effectNotes.push(`Cyclone Infusion`);
        blastData.system.actions[0].actionType = 'save';
        blastData.system.actions[0].range.value = '0';
        blastData.system.actions[0].measureTemplate = measure(20);
        save(blastData, 'ref');
        divideDamage(dmgParts, 2);
        appendBaseName(dmgParts, 'Cyclone');
        return [dmgParts, blastData];
    },
    'deadly-earth': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.actions[0].actionType = 'save';
        blastData.system.actions[0].range.value = '120';
        blastData.system.actions[0].measureTemplate = measure(20);
        return [dmgParts, blastData];
    },
    detonation: (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.effectNotes.push(`Detonation Infusion`);
        blastData.system.actions[0].actionType = 'save';
        blastData.system.actions[0].range.value = '0';
        blastData.system.actions[0].measureTemplate = measure(20);
        save(blastData, 'ref');
        return [dmgParts, blastData];
    },
    eruption: (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.actions[0].actionType = 'save';
        blastData.system.actions[0].range.value = '120';
        blastData.system.actions[0].measureTemplate = measure(10);
        save(blastData, 'ref');
        if (blastConfig.type === 'physical') divideDamage(dmgParts, 2);
        return [dmgParts, blastData];
    },
    explosion: (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.actions[0].actionType = 'save';
        blastData.system.actions[0].range.value = '120';
        blastData.system.actions[0].measureTemplate = measure(20);
        save(blastData, 'ref');
        return [dmgParts, blastData];
    },
    'extended-range': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.actions[0].range.value = '120';
        return [dmgParts, blastData];
    },
    'extreme-range': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.actions[0].range.value = '480';
        return [dmgParts, blastData];
    },
    'fan-of-flames': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.actions[0].actionType = 'save';
        blastData.system.actions[0].range.value = '0';
        blastData.system.actions[0].measureTemplate = measure(15, 'cone');
        save(blastData, 'ref');
        return [dmgParts, blastData];
    },
    'flurry-of-blasts': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.actions[0].formulaicAttacks.bonus.formula = '@formulaicAttack * -5';
        if (instance.actor.classes.kineticist.level >= 20)
            blastData.system.actions[0].formulaicAttacks.count.formula = '4';
        else if (instance.actor.classes.kineticist.level >= 16)
            blastData.system.actions[0].formulaicAttacks.count.formula = '3';
        else if (instance.actor.classes.kineticist.level >= 10)
            blastData.system.actions[0].formulaicAttacks.count.formula = '2';
        else blastData.system.actions[0].formulaicAttacks.count.formula = '1';

        // Base simple blast
        let BASE = ['1d6', 'Simple'] as BlastDamagePart;
        // Elemental Overflow
        let EO = [
            '(min(@resources.classFeat_burn.value, floor(@classes.kineticist.level / 3)) * 2)',
            'Elemental Overflow',
        ] as BlastDamagePart;
        // Physical blast bonus
        let PB = ['@classes.kineticist.level', 'Physical blast'] as BlastDamagePart;
        // Array of damage parts in the form of [str:damage string, str:description]
        dmgParts = [BASE];

        // Add physical bonus
        if (blastConfig.type === 'physical') dmgParts.push(PB);

        // Add elemental overflow
        dmgParts.push(EO);

        return [dmgParts, blastData];
    },
    'focused-blast': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.actions[0].attackBonus += ' +1';
        return [dmgParts, blastData];
    },
    'foe-throw': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        save(blastData, 'fort');
        return [dmgParts, blastData];
    },
    'force-hook': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        return [dmgParts, blastData];
    },
    fragmentation: (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.actions[0].range.value = '120';
        save(blastData, 'ref');
        return [dmgParts, blastData];
    },
    impale: (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        save(blastData, 'ref');
        blastData.system.actions[0].measureTemplate = measure(30, 'ray');
        return [dmgParts, blastData];
    },
    'kinetic-blade': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.type = 'attack';
        blastData = melee(blastData, formData);
        return [dmgParts, blastData];
    },
    'kinetic-fist': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.type = 'attack';
        blastData = melee(blastData, formData);
        return [dmgParts, blastData];
    },
    'kinetic-whip': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.type = 'attack';
        blastData = melee(blastData, formData, { range: 15 });
        return [dmgParts, blastData];
    },
    'many-throw': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        save(blastData, 'fort');
        return [dmgParts, blastData];
    },
    'mobile-blast': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.actions[0].actionType = 'save';
        save(blastData, 'ref');
        return [dmgParts, blastData];
    },
    singularity: (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.actions[0].actionType = 'save';
        save(blastData, 'ref');
        blastData.system.actions[0].measureTemplate = measure(15);
        return [dmgParts, blastData];
    },
    snake: (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.actions[0].range.value = '120';
        return [dmgParts, blastData];
    },
    spindle: (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.actions[0].actionType = 'save';
        blastData.system.actions[0].range.value = '30';
        save(blastData, 'ref');
        blastData.system.actions[0].measureTemplate = measure(10, 'ray');
        return [dmgParts, blastData];
    },
    spray: (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.actions[0].actionType = 'save';
        blastData.system.actions[0].range.value = '0';
        save(blastData, 'ref');
        blastData.system.actions[0].measureTemplate = measure(30, 'cone');
        return [dmgParts, blastData];
    },
    'telekinetic-boomerang': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        return [dmgParts, blastData];
    },
    thundercrash: (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.actions[0].actionType = 'save';
        blastData.system.actions[0].range.value = '0';
        blastData.system.actions[0].measureTemplate = measure(10);
        dmgParts[0][0] = `(min(5, ceil(@classes.kineticist.level /2)))d6`;
        blastData.system.actions[0].ability.damageMult = 1;
        save(blastData, 'ref');
        return [dmgParts, blastData];
    },
    torrent: (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.actions[0].actionType = 'save';
        blastData.system.actions[0].range.value = '30';
        save(blastData, 'ref');
        blastData.system.actions[0].measureTemplate = measure(30, 'ray');
        if (blastConfig.type === 'physical') divideDamage(dmgParts, 2);
        appendBaseName(dmgParts, 'Torrent');
        return [dmgParts, blastData];
    },
    tremor: (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        return [dmgParts, blastData];
    },
    wall: (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        return [dmgParts, blastData];
    },
    'whip-hurricane': (instance: BlastFactory, dmgParts: BlastDamageParts, blastData: any, blastConfig: BlastConfig, formData: any) => {
        blastData.system.actions[0].range.value = 15;
        return [dmgParts, blastData];
    },
};
