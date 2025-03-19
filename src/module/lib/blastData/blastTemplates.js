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
            'min(@resources.classFeat_burn.value , floor(@classes.kineticist.level / 3))[Elemental Overflow]',
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
import { defaultDC } from '../config';

const baseBlast = {
    //_id: 'DnYYjPRTPydgAtzz',
    name: 'KE Managed Blast ',
    type: 'feat',
    img: 'systems/pf1/icons/spells/lighting-sky-1.jpg',
    system: {
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
        attackBonus: 'min(@resources.classFeat_burn.value , floor(@classes.kineticist.level / 3))[Elemental Overflow]',
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
                'min(@resources.classFeat_burn.value , floor(@classes.kineticist.level / 3))[Elemental Overflow]',
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
                'min(@resources.classFeat_burn.value , floor(@classes.kineticist.level / 3))[Elemental Overflow]',
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
                'min(@resources.classFeat_burn.value , floor(@classes.kineticist.level / 3))[Elemental Overflow]',
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
                'min(@resources.classFeat_burn.value , floor(@classes.kineticist.level / 3))[Elemental Overflow]',
        },
    },
]);
export const compositePhysical = { ...mergedCompositePhysical };

let mergedCompositeEnergy = {};
merge(baseBlast, {
    name: 'KE Managed Blast CE',
    img: 'systems/pf1/icons/spells/lighting-sky-1.jpg',
    data: {
        attackBonus: 'min(@resources.classFeat_burn.value , floor(@classes.kineticist.level / 3))[Elemental Overflow]',
    },
});
export const compositeEnergy = { ...mergedCompositeEnergy };

export const melee = (blastData, formData, options = {}) => {
    blastData.system.actions[0].actionType = 'mwak';
    blastData.system.actions[0].range.value = `${options.range ?? 5}`;
    blastData.system.actions[0].extraAttacks = {
        type: 'standard',
    };
    return blastData;
};

/**
 * Create measure template from settings
 * @param {number} size
 * @param {string} [shape=circle]
 * @param {string} [color]
 * @param {string} [texture]
 * @returns {{customColor: string, size: number, overrideColor: boolean, overrideTexture: boolean, customTexture: string, type: string}}
 */
export const measure = (size, shape, color, texture) => {
    return {
        color: '',
        customColor: color ?? '',
        customTexture: texture ?? '',
        overrideColor: color !== undefined,
        overrideTexture: texture !== undefined,
        size: size ?? 10,
        texture: '',
        type: shape ?? 'circle',
    };
};

export const divideDamage = (dmgParts, divisor) => {
    dmgParts[0][0] = `(floor((${dmgParts[0][0]})/2))`;
    for (let i = 1; i < dmgParts.length; i++) {
        dmgParts[i][0] = `(${dmgParts[i][0]})/2`;
    }
    return dmgParts;
};

export const appendBaseName = (dmgParts, suffix) => {
    dmgParts[0][1] += ` ${suffix}`;
    return dmgParts;
};
export const setBaseName = (dmgParts, blastName) => {
    dmgParts[0][1] = `${blastName}`;
    return dmgParts;
};

export const save = (blastData, type, negate, dc) => {
    // Exit without modification if a save is already set
    if (blastData.system.actions[0].save.type !== '') return;

    if (type === 'ref' && !negate) negate = 'half';
    let saveName = 'Fortitude';
    if (type === 'ref') saveName = 'Reflex';
    else if (type === 'will') saveName = 'Will';
    blastData.system.actions[0].save = {
        dc: dc ?? defaultDC,
        description: `${saveName} ${negate ?? 'negates'}`,
        type: type ?? 'fort',
    };
};

export const saveRef = {
    dc: defaultDC,
    description: 'Reflex half',
    type: 'ref',
};
export const saveFort = {
    dc: defaultDC,
    description: 'Fortitude negates',
    type: 'fort',
};
export const saveFortPartial = {
    dc: defaultDC,
    description: 'Fortitude partial',
    type: 'fort',
};
export const saveWill = {
    dc: defaultDC,
    description: 'Will negates',
    type: 'will',
};
