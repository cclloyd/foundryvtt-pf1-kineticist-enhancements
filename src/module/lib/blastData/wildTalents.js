/* eslint-disable no-unused-vars */

export const wildTalents = {
    'airs-reach': {
        id: 'airs-reach',
        name: "Air's Reach",
        transformBlast: (dmgParts, blastData, blastConfig, formData) => {
            if (blastConfig.class === 'simple') {
                if (blastConfig.name === 'air' || blastConfig.name === 'electric') blastData.data.range.value *= 2;
            } else {
                if (blastConfig.blast1 === 'air' || blastConfig.blast1 === 'electric') blastData.data.range.value *= 2;
                else if (blastConfig.blast2 === 'air' || blastConfig.blast2 === 'electric')
                    blastData.data.range.value *= 2;
                else if (blastConfig.blast3 === 'air' || blastConfig.blast3 === 'electric')
                    blastData.data.range.value *= 2;
            }
            return [dmgParts, blastData];
        },
    },
};
