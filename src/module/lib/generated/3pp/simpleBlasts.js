export const simpleBlasts3pp = {
    bone: {
        id: 'bone',
        name: 'Bone',
        type: 'physical',
        damageType: ['bludgeoning, piercing, or slashing'],
        element: ['viscera'],
        description:
            'You fire bones from your hands (which regenerate instantly and have no effect on your physical form) to assault a foe.',
        icon: 'systems/pf1/icons/spells/wind-sky-1.jpg',
    },
    chrono: {
        id: 'chrono',
        name: 'Chrono',
        type: 'energy',
        damageType: ['untyped'],
        element: ['time'],
        description:
            'You fire bones from your hands (which regenerate instantly and have no effect on your physical form) to assault a foe.',
        icon: 'systems/pf1/icons/spells/wind-sky-1.jpg',
    },
    light: {
        id: 'light',
        name: 'Light',
        type: 'physical',
        damageType: ['bludgeoning'],
        element: ['light'],
        description: 'You slam into a single foe with a blast of solid light.',
        icon: 'systems/pf1/icons/spells/wind-sky-1.jpg',
    },
    poison: {
        id: 'poison',
        name: 'Poison',
        type: 'energy',
        damageType: ['acid'],
        element: ['poison'],
        description: 'You douse a foe in a gout of acid.',
        icon: 'systems/pf1/icons/spells/wind-sky-1.jpg',
    },
    sonic: {
        id: 'sonic',
        name: 'Sonic',
        type: 'energy',
        damageType: ['sonic'],
        element: ['sound'],
        description:
            'You assault a foe with a wave of sound. The damage dealt by this blast is 1 step lower than normal (1d4 instead of 1d6.)',
        icon: 'systems/pf1/icons/spells/wind-sky-1.jpg',
    },
    vibration: {
        id: 'vibration',
        name: 'Vibration',
        type: 'physical',
        damageType: ['bludgeoning'],
        element: ['sound'],
        description:
            'You assault a foe with a wave of sound. The damage dealt by this blast is 1 step lower than normal (1d4 instead of 1d6.)',
        icon: 'systems/pf1/icons/spells/wind-sky-1.jpg',
    },
};

export const simpleBlasts3ppAsArray = () => Object.entries(simpleBlasts3pp).map((i) => i[1]);
