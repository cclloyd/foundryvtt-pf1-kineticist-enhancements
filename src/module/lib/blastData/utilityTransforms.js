export const utilityTransforms = {
    'aetheric-boost': (instance, dmgParts, blastData, blastConfig, formData) => {
        // TODO: Add working boost here
        blastData.system.attackNotes.push(`Aetheric Boost`);
        return [dmgParts, blastData];
    },
    'airs-reach': (instance, dmgParts, blastData, blastConfig, formData) => {
        // If air is an element in the blastConfig
        if (blastConfig.element.indexOf('air') > -1) {
            if (blastData.system.actions[0].actionType !== 'mwak') {
                blastData.system.attackNotes.push(`Air's Reach`);
                blastData.system.actions[0].range.value = `${parseInt(blastData.system.actions[0].range.value) * 2}`;
            }
        }
        return [dmgParts, blastData];
    },
    'push-special': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.system.attackNotes.push(`Special Push Blast`);
        blastData.name = `Forceful ${blastData.name}`.replace('Blast', 'Push');
        blastData.system.actions[0].range.value = 60;
        dmgParts[0][0] = `(@classes.kineticist.level )d6`;
        return [dmgParts, blastData];
    },
};
