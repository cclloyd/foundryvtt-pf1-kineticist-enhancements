import { defaultBlasts, ns } from './config';

export const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
};

export const debug = () => {
    CONFIG.debug.hooks = true;
};

export const getAllPlayersActors = async () => {
    let actors = game.actors.entities.filter((o) => o.hasPlayerOwner);
    console.debug('Actors:', actors);
    return actors;
};

export const getSimpleBlasts = () => {
    return defaultBlasts.filter((blast) => {
        return blast.class === 'simple';
    });
};

export const getCompositeBlasts = (simpleBlasts) => {
    console.log('getting DEFAULT BLASTS', simpleBlasts);
    const all = defaultBlasts.filter((blast) => {
        return blast.class === 'composite';
    });
    console.log('defaultBlasts', all);
    const possible = [];
    for (let b of all) {
        let match1 = false;
        let match2 = false;
        let match3 = false;
        console.log('b', b);
        // TODO: Different function for getting composite blasts from config and getting the ones available for the form
        for (let s of simpleBlasts) {
            if (s.id === b.blast1) match1 = true;
            if (s.id === b.blast2) match2 = true;
            if (b.blast3 === null || s === b.blast3) match3 = true;
        }
        if (match1 && match2 && match3) possible.push(b);
    }
    console.log('possible', possible);
    return possible;
};

export const defaultCompositeTransform = (dmgParts, blastData, blastConfig, formData) => {
    blastData.data.attackNotes.push(`Composite Blast`);
    dmgParts[0][0] = dmgParts[0][0].replace(/ceil\(@classes.kineticist.level\s?\/2\)d/, '(@classes.kineticist.level)d');
    dmgParts[0][1] = 'Composite';
    return [dmgParts, blastData];
};

export const getAllBlastsFromActor = (actor) => {
    const allSimple = getSimpleBlasts();
    const ownedSimple = [];

    let owned = actor.getFlag(ns, 'simpleBlasts');
    if (owned === undefined) owned = [];
    for (let blast of allSimple) {
        let isOwned = false;
        for (let b of owned) {
            if (b === blast.id) {
                isOwned = true;
                break;
            }
        }
        if (isOwned) ownedSimple.push(blast);
    }

    const allComposite = getCompositeBlasts(owned);

    return {
        simple: ownedSimple,
        composite: allComposite,
    };
};

export const configToItem = (blast, type) => {
    let item = undefined;
    if (type === 'simple') {
        item = { data: {} };
    }
    return item;
};

/**
 * Defines the {@link JQuery} events that are used in FQL.
 *
 * @type {{click: string, dblclick: string, dragstart: string, drop: string, focus: string, focusout: string, mousedown: string}}
 */
export const jquery = {
    click: 'click',
    dblclick: 'dblclick',
    dragenter: 'dragenter',
    dragstart: 'dragstart',
    drop: 'drop',
    focus: 'focus',
    focusout: 'focusout',
    keydown: 'keydown',
    mousedown: 'mousedown',
};
