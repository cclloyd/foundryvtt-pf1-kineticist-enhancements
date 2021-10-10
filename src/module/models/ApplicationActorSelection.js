import { ns } from '../lib/config';
import { getAllBlastsFromActor, getSimpleBlasts, jquery } from '../lib/common';
import { ApplicationActorConfig } from './ApplicationActorConfig';
import { ApplicationBlastAttack } from './ApplicationBlastAttack';

export class ApplicationActorSelection extends Application {
    constructor(options = {}) {
        super(options);
        this.getKineticistActors();
        //if (options.actor) {}
    }

    /**
     * Default Application options
     *
     * @returns {object} options - Application options.
     * @see https://foundryvtt.com/api/Application.html#options
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: `ke-actor-select`,
            classes: [ns],
            template: `modules/${ns}/templates/actor-select.hbs`,
            width: 400,
            height: 600,
            title: 'Kineticist Enhanced Blast Configuration',
        });
    }

    /**
     * Handle closing any confirm delete quest dialog attached to QuestLog.
     *
     * @override
     * @inheritDoc
     */
    async close(options) {
        return super.close(options);
    }

    getKineticistActors() {
        const kineticists = [];
        console.log('GAME', game.actors);
        game.actors.forEach((a) => {
            console.log(a.data.name);
            if (a.data.data.classes.kineticist) {
                console.error('Adding', a);
                kineticists.push(a);
            }
        });
        this.kineticists = kineticists;
        return kineticists;
    }

    /**
     * @override
     * @inheritDoc
     * @see https://foundryvtt.com/api/FormApplication.html#getData
     */
    getData() {
        return foundry.utils.mergeObject(super.getData(), {
            kineticists: this.kineticists,
        });
    }

    openActor(actor) {
        console.warn('Actor:', actor);
        new ApplicationActorConfig({ actor: actor }).render(true);
    }

    /**
     * Defines all jQuery control callbacks with event listeners for click, drag, drop via various CSS selectors.
     *
     * @param {JQuery}  html - The jQuery instance for the window content of this Application.
     *
     * @see https://foundryvtt.com/api/FormApplication.html#activateListeners
     */
    activateListeners(html) {
        super.activateListeners(html);

        const doAttack = (actor) => {
            new ApplicationBlastAttack({ actor: actor }).render(true);
        };

        //html.on(jquery.click, '.do-attack', doAttack);

        for (let k of this.kineticists) {
            html.on(jquery.click, `#ke-actor-select-${k.data._id}`, () => {
                this.openActor(k);
            });
            html.on(jquery.click, `#ke-actor-select-${k.data._id}-attack`, () => {
                doAttack(k);
            });
        }
    }
}
