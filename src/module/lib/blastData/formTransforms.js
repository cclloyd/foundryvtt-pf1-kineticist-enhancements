/* eslint-disable no-unused-vars */
import { melee } from './blastTemplates';

export const formTransforms = {
    'kinetic-blade': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.data.attackNotes.push(`Kinetic Blade Infusion`);
        blastData.data.actions[0].formulaicAttacks = melee;
        blastData.data.actions[0].range.value = '5';
        return [dmgParts, blastData];
    },
    'extended-range': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.data.attackNotes.push(`Extended-Range Infusion`);
        blastData.data.actions[0].range.value = '120';
        return [dmgParts, blastData];
    },
    'extreme-range': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.data.attackNotes.push(`Extreme-Range Infusion`);
        blastData.data.actions[0].range.value = '480';
        return [dmgParts, blastData];
    },
    'flurry-of-blasts': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.data.attackNotes.push(`Flurry of Blasts`);
        blastData.data.actions[0].formulaicAttacks.bonus.formula = '@formulaicAttack * -5';

        if (instance.actor.data.data.classes.kineticist.level >= 20)
            blastData.data.actions[0].formulaicAttacks.count.formula = '4';
        else if (instance.actor.data.data.classes.kineticist.level >= 16)
            blastData.data.actions[0].formulaicAttacks.count.formula = '3';
        else if (instance.actor.data.data.classes.kineticist.level >= 10)
            blastData.data.formulaicAttacks.count.formula = '2';
        else blastData.data.actions[0].formulaicAttacks.count.formula = '1';

        // Base simple blast
        let BASE = ['1d6', 'Simple'];
        // Elemental Overflow
        let EO = ['(min(@resources.burn.value, floor(@classes.kineticist.level /3))*2)', 'Elemental Overflow'];
        // Physical blast bonus
        let PB = ['@classes.kineticist.level', 'Physical blast'];
        // Array of damage parts in the form of [str:damage string, str:description]
        dmgParts = [BASE];

        // Add physical bonus
        if (blastConfig.type === 'physical') {
            dmgParts.push(PB);
        } else {
            console.log();
        }

        // Add elemental overflow
        dmgParts.push(EO);

        return [dmgParts, blastData];
    },
    'kinetic-whip': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.data.attackNotes.push(`Kinetic Whip Infusion`);
        blastData.data.actions[0].formulaicAttacks = melee;
        blastData.data.actions[0].range.value = 15;
        return [dmgParts, blastData];
    },
    'whip-hurricane': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.data.attackNotes.push(`Whip Hurricane Infusion`);
        blastData.data.actions[0].range.value = 15;
        return [dmgParts, blastData];
    },
};
