export const baseData = {
    name: 'Test',
    type: 'feat',
    data: {
        actions: [],
        featType: 'misc',
        typeName: 'Miscellaneous',
    },
} as any;

const baseAction = {
    name: 'Attack',
    img: 'icons/svg/item-bag.svg',
    description: '',
    activation: {
        cost: 1,
        type: 'standard',
    },
    range: {
        value: '30',
        units: 'ft',
    },
    attackName: '',
    actionType: 'rwak',
    attackBonus: 'min(@resources.classFeat_burn.value, floor(@classes.kineticist.level / 3))[Elemental Overflow]',
    critConfirmBonus: '',
    damage: {
        parts: [],
        critParts: [],
        nonCritParts: [],
    },
    attackParts: [],
    formulaicAttacks: {
        count: {
            formula: '',
            value: 0,
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
        dc: '',
        type: '',
        description: '',
    },
    effectNotes: [],
    attackNotes: [],
} as any;

export const getDefaultAction = () => {
    // @ts-ignore
    let subAction = globalThis.pf1.components.ItemAction.defaultData;
    subAction = foundry.utils.mergeObject(subAction, baseAction);
    return subAction;
};

export const getBaseData = () => {
    return {
        name: 'KE Managed Blast Base',
        type: 'feat',
        img: 'icons/svg/item-bag.svg',
        system: {
            actions: [getDefaultAction()],
            featType: 'misc',
        },
    } as any;
};
