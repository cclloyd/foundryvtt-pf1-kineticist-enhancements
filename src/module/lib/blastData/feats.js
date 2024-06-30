export const feats = {
    acceleratedGathering: {
        id: 'acceleratedGathering',
        name: 'Accelerated Gathering',
        prerequisites: ['Gather power class feature', '5th-level kineticist'],
        benefit:
            'When you use your gather power class feature, you can also spend a standard action to reduce the total burn cost of a blast wild talent used on your next turn by 2. At 11th level you can spend a standard action to reduce the total burn cost of a wild talent used on your next turn by 3. Gathering power in this way ends your turn immediately. You cannot gather power on your next round on your next round as a move action to further reduce burn cost.',
        icon: 'systems/pf1/icons/spells/wind-sky-1.jpg',
        burn: '-',
    },
    feat_afterburn: {
        id: 'feat_afterburn',
        name: 'Afterburn',
        prerequisites: ['1st-level kineticist'],
        benefit:
            'If you accept burn from a wild talent (except for your elemental defense), on your next round you can reduce the burn cost of an infusion by 1.',
        icon: 'systems/pf1/icons/spells/wind-sky-1.jpg',
        burn: '-',
    },
    kineticAcceleration: {
        id: 'kineticAcceleration',
        name: 'Kinetic Acceleration',
        prerequisites: ['Character level 7th'],
        benefit:
            'Whenever you are affected by a haste spell or effect, increase the attack bonus, reflex save, and dodge bonus by +1. In addition, when you use the gather energy class feature while affected by haste, you can increase the reduction of a blast’s burn an additional 1.',
        icon: 'systems/pf1/icons/spells/wind-sky-1.jpg',
        burn: '-',
    },
    feat_twoweaponFighting: {
        id: 'feat_twoweaponFighting',
        name: 'Two-Weapon Fighting',
        prerequisites: ['dex 15'],
        benefit:
            'Your penalties on attack rolls for fighting with two weapons are reduced. The penalty for your primary hand lessens by 2 and the one for your off hand lessens by 6. See Two-Weapon Fighting.',
        icon: 'systems/pf1/icons/spells/wind-sky-1.jpg',
        burn: '-',
    },
};

export const mythicFeats = {
    feat_mythicAirsReach: {
        id: 'feat_mythicAirsReach',
        name: "Mythic Air's Reach",
        prerequisites: ["Air's Reach"],
        benefit: 'The range of air blasts, air wild talents, or composite blasts that include air triples.',
        icon: 'systems/pf1/icons/spells/wind-sky-1.jpg',
        burn: '-',
    },
    mythicSupercharge: {
        id: 'mythicSupercharge',
        name: 'Mythic Supercharge',
        prerequisites: ['supercharge'],
        benefit: 'The kineticist increases the burn cost reductions gained with supercharge by 1 additional point.',
        icon: 'systems/pf1/icons/spells/wind-sky-1.jpg',
        burn: '-',
    },
    feat_mythicCompositeSpecialization: {
        id: 'feat_mythicCompositeSpecialization',
        name: 'Mythic Composite Specialization',
        prerequisites: ['composite-specialization'],
        benefit: 'The burn cost of all the kineticist’s composite blasts is reduced by 2 points rather than 1.',
        icon: 'systems/pf1/icons/spells/wind-sky-1.jpg',
        burn: '-',
    },
    mythicGatherPower: {
        id: 'mythicGatherPower',
        name: 'Mythic Gather Power',
        prerequisites: [],
        benefit:
            'The kineticist can gather power as a swift action, or as an immediate action if she is at least mythic tier 4. At mythic tier 7, the kineticist does not need to have her hands free to gather power. In addition, the kineticist adds her mythic tier to concentration checks made to avoid losing energy if she takes damage during or after gathering power and before using the kinetic blast that releases it.',
        icon: 'systems/pf1/icons/spells/wind-sky-1.jpg',
        burn: '-',
    },
    feat_mythicKineticBlast: {
        id: 'feat_mythicKineticBlast',
        name: 'Mythic Kinetic Blast',
        prerequisites: [],
        benefit:
            'The kineticist infuses mythic energies in one of her kinetic blasts. A mythic simple kinetic blast deals an additional 1d6 of damage at mythic tier 1, and again at mythic tiers 4, 7, and 10. A mythic composite kinetic blast deals an additional +2d6 points of damage at mythic tier 1, and this damage increases by an additional 2d6 at mythic tiers 4, 7, and 10.\n\nSome blasts gain other specific benefits when selected with mythic kinetic blast, as noted below.',
        icon: 'systems/pf1/icons/spells/wind-sky-1.jpg',
        burn: '-',
    },
};
