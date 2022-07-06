export const utilityTransforms = {
    'aetheric-boost': (instance, dmgParts, blastData, blastConfig, formData) => {
        // TODO: Add working boost here
        blastData.data.attackNotes.push(`Aetheric Boost`);
        return [dmgParts, blastData];
    },
    'airs-reach': (instance, dmgParts, blastData, blastConfig, formData) => {
        // If air is an element in the blastConfig
        if (blastConfig.element.indexOf('air') > -1) {
            blastData.data.attackNotes.push(`Air's Reach`);
            blastData.data.actions[0].range.value = `${parseInt(blastData.data.actions[0].range.value) * 2}`;
        }
        return [dmgParts, blastData];
    },
    'push-special': (instance, dmgParts, blastData, blastConfig, formData) => {
        blastData.data.attackNotes.push(`Special Push Blast`);
        blastData.name = `Forceful ${blastData.name}`.replace('Blast', 'Push');
        blastData.data.actions[0].range.value = 60;
        dmgParts[0][0] = `(@classes.kineticist.level )d6`;
        console.log('dmgParts', dmgParts);
        return [dmgParts, blastData];
    },
};
