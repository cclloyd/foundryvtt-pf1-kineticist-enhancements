import { compositeBlastsAsArray } from './generated/compositeBlasts';

export const sleep = (time) => {
    return new Promise((resolve) => setTimeout(resolve, time));
};

export const debug = () => {
    //CONFIG.debug.hooks = true;
};

export const getAllPlayersActors = async () => {
    let actors = game.actors.entities.filter((o) => o.hasPlayerOwner);
    console.debug('Actors:', actors);
    return actors;
};

export const getCompositeBlasts = (simpleBlasts, include3pp = true) => {
    return compositeBlastsAsArray(include3pp).filter((b) => {
        let count = 0;

        for (let s of simpleBlasts) {
            if (s.id === b.blast1) count++;
            if (s.id === b.blast2) count++;
            if (s.id === b.blast3 || (b.blast3 === null && count > 1)) count++;
            if (count > 2) break;
            // TODO: Match special cases like (any) or (any simple physical) or (any energy)
        }

        if (count > 2) return b;
    });
};

/**
 * Catch-all transform for composite blasts.  Converts damage to match that of a composite blast.
 */
export const defaultCompositeTransform = (dmgParts, blastData, blastConfig, formData) => {
    blastData.system.attackNotes.push(`Composite Blast`);
    dmgParts[0][0] = dmgParts[0][0].replace(/ceil\(@classes.kineticist.level\s?\/2\)d/, '(@classes.kineticist.level)d');
    dmgParts[0][1] = 'Composite';
    return [dmgParts, blastData];
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
