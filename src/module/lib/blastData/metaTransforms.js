/* eslint-disable no-unused-vars */
export const metaTransforms = {
    empower: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].name += ' (Empowered)';
        blastData.system.attackNotes.push(`Empowered`);

        for (let i = 0; i < dmgParts.length; i++) {
            dmgParts[i][0] = `(floor(${dmgParts[i][0]} *1.5))`;
            dmgParts[i][1] += ' (Empowered)';
        }
        blastData.system.actions[0].ability.damageMult *= 1.5;
        blastData.flags.baseDamageModified = true;
        return [dmgParts, blastData];
    },
    maximize: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].name += ' (Maximized)';
        blastData.system.attackNotes.push(`Maximized`);
        let dmg = dmgParts[0][0];
        let [_, dmgBase, dmgStep] = dmg.match(/(.+)d(\d+)/);

        dmg = dmg.replace(/(.+)d(\d+)/, `(${dmgBase}*${dmgStep})`);
        dmgParts[0][0] = dmg;
        dmgParts[0][1] += ` (Maximized) (${dmgParts[0][0]})`;
        blastData.flags.baseDamageModified = true;
        return [dmgParts, blastData];
    },
    minimize: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.actions[0].name += ' (Minimized)';
        blastData.system.attackNotes.push(`Minimized`);
        let dmg = dmgParts[0][0];
        let [, dmgBase, dmgStep] = dmg.match(/((?:ceil)?\(@classes\.kineticist\.level\s*(?:\/\d)?\))d(\d+)/);

        if (blastData.system.attackNotes.includes('Empowered'))
            dmg = dmg.replace(/(?:ceil)?\(@classes\.kineticist\.level\s*(?:\/\d)?\)d\d+/, `floor(${dmgBase}*1.5)`);
        else dmg = dmg.replace(/(?:ceil)?\(@classes\.kineticist\.level\s*(?:\/\d)?\)d\d+/, `(${dmgBase})`);
        dmgParts[0][0] = dmg;
        dmgParts[0][1] += ' (Minimized)';
        blastData.flags.baseDamageModified = true;
        return [dmgParts, blastData];
    },
    quicken: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.attackNotes.push(`Quickened`);
        blastData.system.actions[0].activation.type = 'swift';
        return [dmgParts, blastData];
    },
    twice: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.attackNotes.push(`Twice`);
        blastData.system.actions[0].formulaicAttacks.count.formula = '1';
        return [dmgParts, blastData];
    },
};
