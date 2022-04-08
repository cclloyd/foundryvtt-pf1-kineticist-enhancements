/* eslint-disable no-unused-vars */

export const substanceTransforms = {
    synaptic: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.data.attackNotes.push(`Synaptic Infusion`);
        blastData.data.description.value = `Staggers for [[1]] round on a failed save.`;
        blastData.data.save = {
            dc: '10 + @classes.kineticist.level + @abilities.con.mod',
            description: 'Will negates',
            type: 'will',
        };
        return [dmgParts, blastData];
    },
    thundering: (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.data.attackNotes.push(`Thundering Infusion`);
        blastData.data.description.value = `<b>Permanently</b> deafens on a failed save.`;
        blastData.data.save = {
            dc: '10 + @classes.kineticist.level + @abilities.con.mod',
            description: 'Fortitude negates',
            type: 'fort',
        };
        return [dmgParts, blastData];
    },
};
