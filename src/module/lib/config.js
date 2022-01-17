export const ns = 'pf1-kineticist-enhancements';

// eslint-disable-next-line no-unused-vars
const exampleSimpleFullDefault = {
    id: 'example',
    name: 'Example',
    class: 'simple',
    type: 'energy',
    damageType: 'fire',
    damageName: 'Fire',
    icon: 'systems/pf1/icons/spells/lighting-sky-1.jpg',
};

export const defaultFormInfusions = [
    {
        id: 'long-range',
        name: 'Long Range',
        type: 'ex',
        class: 'form',
    },
];

export const defaultBlasts = [
    {
        id: 'air',
        name: 'Air',
        class: 'simple',
        type: 'physical',
        damageType: 'bludgeoning',
        damageName: 'Bludgeoning',
        icon: 'systems/pf1/icons/spells/wind-sky-1.jpg',
    },
    {
        id: 'cold',
        name: 'Cold',
        class: 'simple',
        type: 'energy',
        damageType: 'cold',
        damageName: 'Cold',
        icon: 'systems/pf1/icons/spells/beam-blue-1.jpg',
    },
    {
        id: 'electric',
        name: 'Electric',
        class: 'simple',
        type: 'energy',
        damageType: 'electric',
        damageName: 'Electric',
        icon: 'systems/pf1/icons/spells/lighting-sky-1.jpg',
    },
    {
        id: 'thunderstorm',
        name: 'Thunderstorm',
        class: 'composite',
        type: 'physical',
        damageType: 'bludgeoning/electric',
        damageName: 'Bludgeoning/Electric',
        blast1: 'air',
        blast2: 'electric',
        blast3: null,
        icon: 'systems/pf1/icons/spells/wind-sky-3.jpg',
    },
    {
        id: 'coldsnap',
        name: 'Coldsnap',
        class: 'composite',
        type: 'energy',
        damageType: 'cold/electric',
        damageName: 'Cold/Electric',
        blast1: 'cold',
        blast2: 'electric',
        blast3: null,
        icon: 'systems/pf1/icons/spells/lightning-blue-3.jpg',
    },
    {
        id: 'blizzard',
        name: 'Blizzard',
        class: 'composite',
        type: 'physical',
        damageType: 'bludgeoning/cold',
        damageName: 'Bludgeoning/Cold',
        blast1: 'air',
        blast2: 'cold',
        blast3: null,
        icon: 'systems/pf1/icons/spells/wind-blue-3.jpg',
    },
];
