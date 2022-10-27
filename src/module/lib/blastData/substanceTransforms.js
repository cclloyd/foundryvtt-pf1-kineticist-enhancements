/* eslint-disable no-unused-vars */

import { defaultDC } from '../config';
import { save, saveFort, saveFortPartial, saveWill } from './blastTemplates';

export const substanceTransforms = {
    blocking: (instance, dmgParts, blastData, blastConfig, formData) => {
        save(blastData, 'fort', 'partial');
        return [dmgParts, blastData];
    },
    bowling: (instance, dmgParts, blastData, blastConfig, formData) => {
        save(blastData, 'fort', 'partial');
        return [dmgParts, blastData];
    },
    synaptic: (instance, dmgParts, blastData, blastConfig, formData) => {
        save(blastData, 'will');
        return [dmgParts, blastData];
    },
    thundering: (instance, dmgParts, blastData, blastConfig, formData) => {
        save(blastData, 'fort');
        return [dmgParts, blastData];
    },
};
