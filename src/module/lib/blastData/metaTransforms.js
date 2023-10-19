/* eslint-disable no-unused-vars */
export const metaTransforms = {
    empower: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.attackNotes.push(`Empowered`);
        // Alter the rest of damage sources
        dmgParts.unshift(['0', 'Base']);

        for (let i = 0; i < dmgParts.length; i++) {
            dmgParts[i][0] = `floor(${dmgParts[i][0]} *1.5)`;
            dmgParts[i][1] += ' (Empowered)';
        }
        dmgParts.push([
            blastConfig.type === 'physical' ? 'floor(@abilities.con.mod * 0.5)' : 'floor(@abilities.con.mod * 0.25)',
            'Constitution (Empowered)',
        ]);
    },
    maximize: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.attackNotes.push(`Maximized`);
        let dmg = dmgParts[0][0];
        let [, dmgBase, dmgStep] = dmg.match(/((?:ceil)?\(@classes\.kineticist\.level\s*(?:\/\d)?\))d(\d+)/);

        if (blastData.system.attackNotes.includes('Empowered'))
            dmg = dmg.replace(
                /(?:ceil)?\(@classes\.kineticist\.level\s*(?:\/\d)?\)d\d+/,
                `floor((${dmgBase}*${dmgStep})*1.5)`,
            );
        else dmg = dmg.replace(/(?:ceil)?\(@classes\.kineticist\.level\s*(?:\/\d)?\)d\d+/, `(${dmgBase}*${dmgStep})`);
        dmgParts[0][0] = dmg;
        dmgParts[0][1] += ' (Maximized)';
        dmgParts.unshift(['0', 'Base']);
    },
    minimize: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.attackNotes.push(`Minimized`);
        let dmg = dmgParts[0][0];
        let [, dmgBase, dmgStep] = dmg.match(/((?:ceil)?\(@classes\.kineticist\.level\s*(?:\/\d)?\))d(\d+)/);

        if (blastData.system.attackNotes.includes('Empowered'))
            dmg = dmg.replace(/(?:ceil)?\(@classes\.kineticist\.level\s*(?:\/\d)?\)d\d+/, `floor(${dmgBase}*1.5)`);
        else dmg = dmg.replace(/(?:ceil)?\(@classes\.kineticist\.level\s*(?:\/\d)?\)d\d+/, `(${dmgBase})`);
        dmgParts[0][0] = dmg;
        dmgParts[0][1] += ' (Minimized)';
        dmgParts.unshift(['0', 'Base']);
    },
};
