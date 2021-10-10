import { config, ns } from './config';

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
    const blasts = [];
    for (let key of Object.keys(config.blasts.simple)) {
        blasts.push(config.blasts.simple[key]);
    }
    return blasts;
};

export const getCompositeBlasts = (simpleBlasts) => {
    const all = config.blasts.composite;
    const possible = [];
    for (let b in all) {
        let match1 = false;
        let match2 = false;
        let match3 = false;
        for (let s of simpleBlasts) {
            if (s === all[b].blast1) match1 = true;
            if (s === all[b].blast2) match2 = true;
            if (all[b].blast3 === null || s === all[b].blast3) match3 = true;
        }
        if (match1 && match2 && match3) possible.push(all[b]);
    }
    return possible;
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
