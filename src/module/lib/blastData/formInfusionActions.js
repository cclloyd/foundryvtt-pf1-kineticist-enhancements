import { melee } from './simple';

export const formInfusionActions = {
    'long-range': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.data.attackNotes.push(`Long-Range Infusion`);
        blastData.data.formulaicAttacks = melee;
        blastData.data.range.value *= 2;
        blastData.name = `Long-Range ${blastConfig.name} Blast`;
        return [dmgParts, blastData];
    },
    whip: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.data.attackNotes.push(`Kinetic Whip Infusion`);
        blastData.data.formulaicAttacks = melee;
        blastData.data.range.value = 15;
        blastData.name = `${blastConfig.name} Whip`;
        return [dmgParts, blastData];
    },
    'whip-hurricane': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.data.attackNotes.push(`Whip Hurricane Infusion`);
        blastData.data.formulaicAttacks = melee;
        blastData.data.range.value = 15;
        blastData.name = `${blastConfig.name} Whip Hurricane`;
        return [dmgParts, blastData];
    },
    blade: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.data.attackNotes.push(`Kinetic Blade Infusion`);
        blastData.data.formulaicAttacks = melee;
        blastData.data.range.value = 5;
        blastData.name = `${blastConfig.name} Blade`;
        return [dmgParts, blastData];
    },
};
