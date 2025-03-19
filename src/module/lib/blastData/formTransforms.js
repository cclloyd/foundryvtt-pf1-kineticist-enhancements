/* eslint-disable no-unused-vars */
import { appendBaseName, divideDamage, measure, melee, save } from './blastTemplates';

export const formTransforms = {
    'blade-rush': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].range.value = '5';
        return [dmgParts, blastData];
    },
    'blade-rush-whip': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].range.value = '15';
        return [dmgParts, blastData];
    },
    'blade-whirlwind': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].range.value = '5';
        return [dmgParts, blastData];
    },
    chain: (instance, dmgParts, blastData, blastConfig, formData) => {
        // TODO: Add decreasing damage
        blastData.system.actions[0].formulaicAttacks = {
            count: { formula: 'ceil(@classes.kineticist.level / 2)' },
            bonus: { formula: '0' },
            label: 'Attack #{0}',
        };
        return [dmgParts, blastData];
    },
    cloud: (instance, dmgParts, blastData, blastConfig, formData) => {
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
    cyclone: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.effectNotes.push(`Cyclone Infusion`);
        blastData.system.actions[0].actionType = 'save';
        blastData.system.actions[0].range.value = '0';
        blastData.system.actions[0].measureTemplate = measure(20);
        save(blastData, 'ref');
        divideDamage(dmgParts, 2);
        appendBaseName(dmgParts, 'Cyclone');
        return [dmgParts, blastData];
    },
    'deadly-earth': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].actionType = 'save';
        blastData.system.actions[0].range.value = '120';
        blastData.system.actions[0].measureTemplate = measure(20);
        return [dmgParts, blastData];
    },
    detonation: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.effectNotes.push(`Detonation Infusion`);
        blastData.system.actions[0].actionType = 'save';
        blastData.system.actions[0].range.value = '0';
        blastData.system.actions[0].measureTemplate = measure(20);
        save(blastData, 'ref');
        return [dmgParts, blastData];
    },
    eruption: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].actionType = 'save';
        blastData.system.actions[0].range.value = '120';
        blastData.system.actions[0].measureTemplate = measure(10);
        save(blastData, 'ref');
        if (blastConfig.type === 'physical') divideDamage(dmgParts, 2);
        return [dmgParts, blastData];
    },
    explosion: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].actionType = 'save';
        blastData.system.actions[0].range.value = '120';
        blastData.system.actions[0].measureTemplate = measure(20);
        save(blastData, 'ref');
        return [dmgParts, blastData];
    },
    'extended-range': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].range.value = '120';
        return [dmgParts, blastData];
    },
    'extreme-range': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].range.value = '480';
        return [dmgParts, blastData];
    },
    'fan-of-flames': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].actionType = 'save';
        blastData.system.actions[0].range.value = '0';
        blastData.system.actions[0].measureTemplate = measure(15, 'cone');
        save(blastData, 'ref');
        return [dmgParts, blastData];
    },
    'flurry-of-blasts': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].formulaicAttacks.bonus.formula = '@formulaicAttack * -5';
        if (instance.actor.classes.kineticist.level >= 20)
            blastData.system.actions[0].formulaicAttacks.count.formula = '4';
        else if (instance.actor.classes.kineticist.level >= 16)
            blastData.system.actions[0].formulaicAttacks.count.formula = '3';
        else if (instance.actor.classes.kineticist.level >= 10)
            blastData.system.actions[0].formulaicAttacks.count.formula = '2';
        else blastData.system.actions[0].formulaicAttacks.count.formula = '1';

        // Base simple blast
        let BASE = ['1d6', 'Simple'];
        // Elemental Overflow
        let EO = [
            '(min(@resources.classFeat_burn.value, floor(@classes.kineticist.level / 3)) * 2)',
            'Elemental Overflow',
        ];
        // Physical blast bonus
        let PB = ['@classes.kineticist.level', 'Physical blast'];
        // Array of damage parts in the form of [str:damage string, str:description]
        dmgParts = [BASE];

        // Add physical bonus
        if (blastConfig.type === 'physical') dmgParts.push(PB);

        // Add elemental overflow
        dmgParts.push(EO);

        return [dmgParts, blastData];
    },
    'focused-blast': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].attackBonus += ' +1';
        return [dmgParts, blastData];
    },
    'foe-throw': (instance, dmgParts, blastData, blastConfig, formData) => {
        save(blastData, 'fort');
        return [dmgParts, blastData];
    },
    'force-hook': (instance, dmgParts, blastData, blastConfig, formData) => {
        return [dmgParts, blastData];
    },
    fragmentation: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].range.value = '120';
        save(blastData, 'ref');
        return [dmgParts, blastData];
    },
    impale: (instance, dmgParts, blastData, blastConfig, formData) => {
        save(blastData, 'ref');
        blastData.system.actions[0].measureTemplate = measure(30, 'ray');
        return [dmgParts, blastData];
    },
    'kinetic-blade': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.type = 'attack';
        blastData = melee(blastData, formData);
        return [dmgParts, blastData];
    },
    'kinetic-fist': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.type = 'attack';
        blastData = melee(blastData, formData);
        return [dmgParts, blastData];
    },
    'kinetic-whip': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.type = 'attack';
        blastData = melee(blastData, formData, { range: 15 });
        return [dmgParts, blastData];
    },
    'many-throw': (instance, dmgParts, blastData, blastConfig, formData) => {
        save(blastData, 'fort');
        return [dmgParts, blastData];
    },
    'mobile-blast': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].actionType = 'save';
        save(blastData, 'ref');
        return [dmgParts, blastData];
    },
    singularity: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].actionType = 'save';
        save(blastData, 'ref');
        blastData.system.actions[0].measureTemplate = measure(15);
        return [dmgParts, blastData];
    },
    snake: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].range.value = '120';
        return [dmgParts, blastData];
    },
    spindle: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].actionType = 'save';
        blastData.system.actions[0].range.value = '30';
        save(blastData, 'ref');
        blastData.system.actions[0].measureTemplate = measure(10, 'ray');
        return [dmgParts, blastData];
    },
    spray: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].actionType = 'save';
        blastData.system.actions[0].range.value = '0';
        save(blastData, 'ref');
        blastData.system.actions[0].measureTemplate = measure(30, 'cone');
        return [dmgParts, blastData];
    },
    'telekinetic-boomerang': (instance, dmgParts, blastData, blastConfig, formData) => {
        return [dmgParts, blastData];
    },
    thundercrash: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].actionType = 'save';
        blastData.system.actions[0].range.value = '0';
        blastData.system.actions[0].measureTemplate = measure(10);
        dmgParts[0][0] = `(min(5, ceil(@classes.kineticist.level /2)))d6`;
        blastData.system.actions[0].ability.damageMult = 1;
        save(blastData, 'ref');
        return [dmgParts, blastData];
    },
    torrent: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].actionType = 'save';
        blastData.system.actions[0].range.value = '30';
        save(blastData, 'ref');
        blastData.system.actions[0].measureTemplate = measure(30, 'ray');
        if (blastConfig.type === 'physical') divideDamage(dmgParts, 2);
        appendBaseName(dmgParts, 'Torrent');
        return [dmgParts, blastData];
    },
    tremor: (instance, dmgParts, blastData, blastConfig, formData) => {
        return [dmgParts, blastData];
    },
    wall: (instance, dmgParts, blastData, blastConfig, formData) => {
        return [dmgParts, blastData];
    },
    'whip-hurricane': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].range.value = 15;
        return [dmgParts, blastData];
    },
};
