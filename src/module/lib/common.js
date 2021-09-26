import { config } from './config';

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
