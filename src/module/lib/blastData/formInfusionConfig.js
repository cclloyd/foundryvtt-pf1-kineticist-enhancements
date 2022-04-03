/* eslint-disable no-unused-vars */
import { melee } from './simple';

export const formInfusions = {
    'long-range': {
        id: 'long-range',
        prepend: true,
        prependText: 'Long-Range',
        append: false,
        name: 'Long Range',
        transform: (instance, dmgParts, blastData, blastConfig, formData) => {
            blastData.data.attackNotes.push(`Long-Range Infusion`);
            blastData.data.formulaicAttacks = melee;
            blastData.data.range.value *= 2;
            return [dmgParts, blastData];
        },
    },
    blade: {
        id: 'blade',
        prepend: false,
        append: true,
        appendText: 'Blade',
        noBlastText: true,
        name: 'Kinetic Blade',
        transform: (instance, dmgParts, blastData, blastConfig, formData) => {
            blastData.data.attackNotes.push(`Kinetic Blade Infusion`);
            blastData.data.formulaicAttacks = melee;
            blastData.data.range.value = 5;
            return [dmgParts, blastData];
        },
    },
    whip: {
        id: 'whip',
        prepend: false,
        append: true,
        appendText: 'Whip',
        noBlastText: true,
        name: 'Kinetic Whip',
        transform: (instance, dmgParts, blastData, blastConfig, formData) => {
            blastData.data.attackNotes.push(`Kinetic Whip Infusion`);
            blastData.data.formulaicAttacks = melee;
            blastData.data.range.value = 15;
            return [dmgParts, blastData];
        },
    },
    'whip-hurricane': {
        id: 'whip-hurricane',
        prepend: false,
        append: true,
        appendText: 'Whip Hurricane',
        noBlastText: true,
        name: 'Whip Hurricane',
        transform: (instance, dmgParts, blastData, blastConfig, formData) => {
            blastData.data.attackNotes.push(`Whip Hurricane Infusion`);
            blastData.data.formulaicAttacks = melee;
            blastData.data.range.value = 15;
            return [dmgParts, blastData];
        },
    },
};
