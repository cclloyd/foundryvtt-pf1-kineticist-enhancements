/* eslint-disable no-unused-vars */
export const metaTransforms = {
    empower: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.data.attackNotes.push(`Empowered`);
        // Alter the rest of damage sources
        console.log('dmgParse', dmgParts);
        for (let i = 0; i < dmgParts.length; i++) {
            dmgParts[i][0] = `floor(${dmgParts[i][0]}*1.5)`;
            dmgParts[i][1] = ', Empowered';
        }
    },
    maximize: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.data.attackNotes.push(`Maximized`);
        let dmg = dmgParts[0][0];
        let [, dmgBase, dmgStep] = dmg.match(/((?:ceil)?\(@classes\.kineticist\.level\s*(?:\/\d)?\))d(\d+)/);

        if (blastData.data.attackNotes.includes('Empowered'))
            dmg = dmg.replace(
                /(?:ceil)?\(@classes\.kineticist\.level\s*(?:\/\d)?\)d\d+/,
                `floor((${dmgBase}*${dmgStep})*1.5)`,
            );
        else dmg = dmg.replace(/(?:ceil)?\(@classes\.kineticist\.level\s*(?:\/\d)?\)d\d+/, `(${dmgBase}*${dmgStep})`);
        dmgParts[0][0] = dmg;
        dmgParts[0][1] = 'Maximized';
    },
};
