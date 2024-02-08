/* eslint-disable no-unused-vars */

import { defaultDC } from '../config';
import { measure, save, saveFort, saveFortPartial, saveWill } from './blastTemplates';

export const specialTransforms = {
    'double-damage': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.attackNotes.push(`x2 Damage`);
        for (let i = 0; i < dmgParts.length; i++) {
            console.log('part', dmgParts[i][0], dmgParts[i][1]);
            dmgParts[i][0] = `(floor(${dmgParts[i][0]})*2)`;
        }
        blastData.system.actions[0].ability.damageMult *= 2;
        blastData.flags.baseDamageModified = true;
        return [dmgParts, blastData];
    },
    'double-area': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.attackNotes.push(`x2 Area`);
        let area = parseInt(blastData.system.actions[0].measureTemplate.size);
        blastData.system.actions[0].measureTemplate.size = area * 2;
        return [dmgParts, blastData];
    },
    'skip-templates': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].measureTemplate = {};
        return [dmgParts, blastData];
    },
};
