export const ns = 'pf1-kineticist-enhancements';

export const config = {
    blasts: {
        simple: {
            air: {
                id: 'air',
                name: 'Air',
                damage: 'bludgeoning',
            },
            cold: {
                id: 'cold',
                name: 'Cold',
                damage: 'cold',
            },
            electric: {
                id: 'electric',
                name: 'Electric',
                damage: 'electric',
            },
        },
        composite: {
            thunderstorm: {
                id: 'thunderstorm',
                name: 'Thunderstorm',
                blast1: 'air',
                blast2: 'electric',
                blast3: null,
            },
            coldsnap: {
                id: 'coldsnap',
                name: 'Coldsnap',
                blast1: 'cold',
                blast2: 'electric',
                blast3: null,
            },
            blizzard: {
                id: 'blizzard',
                name: 'Blizzard',
                blast1: 'air',
                blast2: 'cold',
                blast3: null,
            },
        },
    },
};
