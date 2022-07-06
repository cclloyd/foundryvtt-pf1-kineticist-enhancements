export const utilityTalentsAsArray = () => Object.entries(utilityTalents).map((i) => i[1]);

export const utilityTalents = {
    'aetheric-boost': {
        id: 'aetheric-boost',
        name: 'Aetheric Boost',
        element: ['aether'],
        type: 'Sp',
        level: '3',
        burn: '2',
        prerequisites: [],
        description:
            'You infuse a simple blast you know with aether, causing it to deal 1 additional point of damage of the same type for each of its damage dice; it otherwise acts as the simple blast. At 15th level, you can also infuse a composite blast with aether. To infuse a composite blast in this way, you must accept 1 additional point of burn.',
    },
    'airs-reach': {
        id: 'airs-reach',
        name: "Air's Reach",
        element: ['air'],
        type: 'Su',
        level: '1',
        burn: '-',
        prerequisites: [],
        description:
            'When using air blasts, air wild talents, or composite blasts that include air, double the blast’s effective range. This effect applies after altering the range due to effects such as the extended range infusion. This doubles only the blast’s effective range, not the area of effect for infusions like cloud and cyclone.',
    },
    'push-special': {
        id: 'push-special',
        name: 'Special Push',
        element: ['air'],
        type: 'Su',
        level: '1',
        burn: '-',
        prerequisites: [],
        description: 'Dash forward in a flash of lightning and forcefully throw the enemy while dealing damage.',
    },
};
