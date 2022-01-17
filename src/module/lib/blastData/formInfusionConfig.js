/* eslint-disable no-unused-vars */
import { melee } from './simple';

export const formInfusions = {
    'long-range': {
        prepend: true,
        prependText: 'Long-Range',
        append: false,
        transform: (instance, dmgParts, blastData, blastConfig, formData) => {
            blastData.data.attackNotes.push(`Long-Range Infusion`);
            blastData.data.formulaicAttacks = melee;
            blastData.data.range.value *= 2;
            return [dmgParts, blastData];
        },
    },
    blade: {
        prepend: false,
        append: true,
        appendText: 'Blade',
        noBlastText: true,
        transform: (instance, dmgParts, blastData, blastConfig, formData) => {
            blastData.data.attackNotes.push(`Kinetic Blade Infusion`);
            blastData.data.formulaicAttacks = melee;
            blastData.data.range.value = 5;
            return [dmgParts, blastData];
        },
    },
    whip: {
        prepend: false,
        append: true,
        appendText: 'Whip',
        noBlastText: true,
        transform: (instance, dmgParts, blastData, blastConfig, formData) => {
            blastData.data.attackNotes.push(`Kinetic Whip Infusion`);
            blastData.data.formulaicAttacks = melee;
            blastData.data.range.value = 15;
            return [dmgParts, blastData];
        },
    },
    'whip-hurricane': {
        prepend: false,
        append: true,
        appendText: 'Whip Hurricane',
        noBlastText: true,
        transform: (instance, dmgParts, blastData, blastConfig, formData) => {
            blastData.data.attackNotes.push(`Whip Hurricane Infusion`);
            blastData.data.formulaicAttacks = melee;
            blastData.data.range.value = 15;
            return [dmgParts, blastData];
        },
    },
};
