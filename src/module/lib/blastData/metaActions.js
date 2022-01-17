/* eslint-disable no-unused-vars */
export const metaActions = {
    empower: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.data.attackNotes.push(`Empowered`);
        // Alter the rest of damage sources
        for (let i = 0; i < dmgParts.length; i++) {
            dmgParts[i][0] = `(${dmgParts[i][0]}*1.5)`;
            dmgParts[i][1] += ', Empowered';
        }
        return [dmgParts, blastData];
    },
    maximize: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.data.attackNotes.push(`Maximized`);
        let dmg = dmgParts[0][0];
        console.log('max dmg', dmg);
        let [, dmgBase, dmgStep] = dmg.match(/((?:ceil)?\(@classes\.kineticist\.level\s*(?:\/\d)?\))d(\d+)/);
        dmg = dmg.replace(/(?:ceil)?\(@classes\.kineticist\.level\s*(?:\/\d)?\)d\d+/, `(${dmgBase}*${dmgStep})`);
        dmgParts[0][0] = dmg;
        dmgParts[0][1] += ', Maximized';
        return [dmgParts, blastData];
    },
};
