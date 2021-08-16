export const ns = 'pf1-kineticist-enhancements';

export const config = {
  blasts: {
    simple: {
      air: {
        name: 'Air',
        damage: 'bludgeoning',
      },
      cold: {
        name: 'Cold',
        damage: 'cold',
      },
      electric: {
        name: 'Electric',
        damage: 'electric',
      },
    },
    composite: {
      thunderstorm: {
        name: 'Thunderstorm',
        blast1: 'air',
        blast2: 'electric',
        blast3: null,
      },
      coldsnap: {
        name: 'Coldsnap',
        blast1: 'cold',
        blast2: 'electric',
        blast3: null,
      },
      blizzard: {
        name: 'Blizzard',
        blast1: 'air',
        blast2: 'cold',
        blast3: null,
      },
    },
  },
}
