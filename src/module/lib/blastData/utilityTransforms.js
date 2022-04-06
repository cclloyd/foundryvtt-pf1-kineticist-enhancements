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
            blastData.data.range.value = `${parseInt(blastData.data.range.value) * 2}`;
        }
        return [dmgParts, blastData];
    },
};
