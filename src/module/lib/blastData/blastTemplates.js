/*const baseBlast = {
    //_id: 'DnYYjPRTPydgAtzz',
    name: 'KE Managed Blast ',
    type: 'feat',
    img: 'systems/pf1/icons/spells/lighting-sky-1.jpg',
    data: {
        description: {
            value: '',
            chat: '',
            unidentified: '',
        },
        tags: [],
        activation: {
            cost: 1,
            type: 'special',
        },
        unchainedAction: {
            activation: {
                cost: 1,
                type: '',
            },
        },
        duration: {
            value: null,
            units: 'inst',
        },
        target: {
            value: '',
        },
        range: {
            value: '30',
            units: 'ft',
            maxIncrements: '',
            minValue: null,
            minUnits: '',
        },
        uses: {
            value: 0,
            per: '',
            autoDeductCharges: true,
            autoDeductChargesCost: '0',
            maxFormula: '',
        },
        measureTemplate: {
            type: '',
            size: '',
            overrideColor: false,
            customColor: '',
            overrideTexture: false,
            customTexture: '',
        },
        attackName: '',
        actionType: 'rwak',
        attackBonus:
            'min(@resources.burn.max - @resources.burn.value, floor(@classes.kineticist.level / 3))[Elemental Overflow]',
        critConfirmBonus: '',
        damage: {
            parts: [
                [
                    'ceil(@classes.kineticist.level/2)d6+ceil(@classes.kineticist.level/2)[Physical blast] + (min(@resources.burn.value, floor(@classes.kineticist.level/3))*2)[Elemental Overflow]',
                    'Bludgeoning',
                ],
            ],
            critParts: [],
            nonCritParts: [],
        },
        attackParts: [],
        formulaicAttacks: {
            count: {
                formula: '0',
            },
            bonus: {
                formula: '',
            },
            label: '',
        },
        formula: '',
        ability: {
            attack: 'dex',
            damage: 'con',
            damageMult: 1,
            critRange: 20,
            critMult: 2,
        },
        save: {
            dc: '0',
            type: '',
            description: '',
        },
        effectNotes: [],
        attackNotes: ['Not Touch Attack'],
        soundEffect: '',
        changes: [],
        changeFlags: {
            loseDexToAC: false,
            noEncumbrance: false,
            mediumArmorFullSpeed: false,
            heavyArmorFullSpeed: false,
        },
        contextNotes: [],
        links: {
            children: [],
            charges: [],
        },
        tag: '',
        useCustomTag: false,
        armorProf: {
            value: [],
            custom: '',
        },
        weaponProf: {
            value: [],
            custom: '',
        },
        flags: {
            boolean: [],
            dictionary: [],
        },
        scriptCalls: [],
        featType: 'misc',
        associations: {
            classes: [],
        },
        showInQuickbar: false,
        nonlethal: false,
        abilityType: 'sp',
        crOffset: '',
        disabled: false,
        conditionals: [],
        identifiedName: 'KE Managed Blast',
        spellArea: '',
    },
    effects: [],
    folder: null,
    sort: 0,
    permission: {
        default: 0,
        gV0LpqZGPPpf1HHy: 3,
    },
    flags: {
        'pf1-kineticist-enhancements': {
            managedSimplePhysical: true,
        },
    },
};*/
import { merge } from 'lodash-es';

const baseBlast = {
    //_id: 'DnYYjPRTPydgAtzz',
    name: 'KE Managed Blast ',
    type: 'feat',
    img: 'systems/pf1/icons/spells/lighting-sky-1.jpg',
    data: {
        description: {
            value: '',
            chat: '',
            unidentified: '',
        },
        tags: [],
        activation: {
            cost: 1,
            type: 'special',
        },
        unchainedAction: {
            activation: {
                cost: 1,
                type: '',
            },
        },
        duration: {
            value: null,
            units: 'inst',
        },
        target: {
            value: '',
        },
        range: {
            value: '30',
            units: 'ft',
            maxIncrements: '',
            minValue: null,
            minUnits: '',
        },
        uses: {
            value: 0,
            per: '',
            autoDeductCharges: true,
            autoDeductChargesCost: '0',
            maxFormula: '',
        },
        measureTemplate: {
            type: '',
            size: '',
            overrideColor: false,
            customColor: '',
            overrideTexture: false,
            customTexture: '',
        },
        attackName: '',
        actionType: 'rwak',
        attackBonus:
            'min(@resources.burn.max - @resources.burn.value, floor(@classes.kineticist.level / 3))[Elemental Overflow]',
        critConfirmBonus: '',
        damage: {
            parts: [['10d6', 'Bludgeoning']],
            critParts: [],
            nonCritParts: [],
        },
        attackParts: [],
        formulaicAttacks: {
            count: {
                formula: '0',
            },
            bonus: {
                formula: '',
            },
            label: '',
        },
        formula: '',
        ability: {
            attack: 'dex',
            damage: 'con',
            damageMult: 1,
            critRange: 20,
            critMult: 2,
        },
        save: {
            dc: '0',
            type: '',
            description: '',
        },
        effectNotes: [],
        attackNotes: [],
        soundEffect: '',
        changes: [],
        changeFlags: {
            loseDexToAC: false,
            noEncumbrance: false,
            mediumArmorFullSpeed: false,
            heavyArmorFullSpeed: false,
        },
        contextNotes: [],
        links: {
            children: [],
            charges: [],
        },
        tag: '',
        useCustomTag: false,
        armorProf: {
            value: [],
            custom: '',
        },
        weaponProf: {
            value: [],
            custom: '',
        },
        flags: {
            boolean: [],
            dictionary: [],
        },
        scriptCalls: [],
        featType: 'misc',
        associations: {
            classes: [],
        },
        showInQuickbar: false,
        nonlethal: false,
        abilityType: 'sp',
        crOffset: '',
        disabled: false,
        conditionals: [],
        identifiedName: 'KE Managed Blast',
        spellArea: '',
    },
    effects: [],
    folder: null,
    sort: 0,
    permission: {
        default: 0,
        gV0LpqZGPPpf1HHy: 3,
    },
    flags: {
        'pf1-kineticist-enhancements': {
            managedSimplePhysical: true,
        },
    },
};

export const templateSimple = merge(
    { ...baseBlast },
    {
        name: 'KE Managed Blast',
        img: 'systems/pf1/icons/spells/lighting-sky-1.jpg',
        data: {
            identifiedName: 'KE Managed Blast',
            attackBonus:
                'min(@resources.burn.max - @resources.burn.value, floor(@classes.kineticist.level / 3))[Elemental Overflow]',
        },
    },
);
export const simplePhysical = merge(
    { ...baseBlast },
    {
        name: 'KE Managed Blast SP',
        img: 'systems/pf1/icons/spells/lighting-sky-1.jpg',
        data: {
            identifiedName: 'KE Managed Blast SP',
            attackBonus:
                'min(@resources.burn.max - @resources.burn.value, floor(@classes.kineticist.level / 3))[Elemental Overflow]',
        },
    },
);

export const simpleEnergy = merge(
    { ...baseBlast },
    {
        name: 'KE Managed Blast SE',
        img: 'systems/pf1/icons/spells/lighting-sky-1.jpg',
        data: {
            identifiedName: 'KE Managed Blast SE',
            attackBonus:
                'min(@resources.burn.max - @resources.burn.value, floor(@classes.kineticist.level / 3))[Elemental Overflow]',
        },
    },
);

let mergedCompositePhysical = {};
merge(mergedCompositePhysical, [
    baseBlast,
    {
        name: 'KE Managed Blast CP',
        img: 'systems/pf1/icons/spells/lighting-sky-1.jpg',
        data: {
            attackBonus:
                'min(@resources.burn.max - @resources.burn.value, floor(@classes.kineticist.level / 3))[Elemental Overflow]',
        },
    },
]);
export const compositePhysical = { ...mergedCompositePhysical };

let mergedCompositeEnergy = {};
merge(baseBlast, {
    name: 'KE Managed Blast CE',
    img: 'systems/pf1/icons/spells/lighting-sky-1.jpg',
    data: {
        attackBonus:
            'min(@resources.burn.max - @resources.burn.value, floor(@classes.kineticist.level / 3))[Elemental Overflow]',
    },
});
export const compositeEnergy = { ...mergedCompositeEnergy };

export const melee = {
    count: {
        formula: 'ceil(@attributes.bab.total / 5) - 1',
    },
    bonus: {
        formula: '@formulaicAttack * -5',
    },
    label: 'Attack #{0}',
};
