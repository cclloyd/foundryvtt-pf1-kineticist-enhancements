import { ns } from '../lib/config';
import { ApplicationBlastAttack } from './ApplicationBlastAttack';
import { ApplicationActorConfig } from './ApplicationActorConfig';

export class ApplicationActorHUD extends Application {
    constructor(options = {}, user = null, actor = null) {
        super(options);
        this.user = user;
        this.actor = actor;
        // TODO: Have hud change buttons based on if they completed first setup or not
    }

    /**
     * Default Application options
     *
     * @returns {object} options - Application options.
     * @see https://foundryvtt.com/api/Application.html#options
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: `ke-token-hud`,
            classes: [ns],
            template: `modules/${ns}/templates/hud.hbs`,
            width: 200,
            height: 40,
            //left: 150,
            //top: 80,
            background: 'none',
            popOut: false,
            minimizable: false,
            resizable: false,
            dragDrop: [],
            tabs: [],
            scrollY: [],
            title: 'Kineticist Action HUD',
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

    /**
     * @override
     * @inheritDoc
     * @see https://foundryvtt.com/api/FormApplication.html#getData
     */
    getData() {
        return foundry.utils.mergeObject(super.getData(), {
            actor: this.actor,
            buttons: [
                {
                    id: 'ke-button-actorconfig',
                    classes: [],
                    text: 'Config',
                },
                {
                    id: 'ke-button-attack',
                    classes: [],
                    text: 'Blast Attack',
                },
            ],
        });
    }

    saveSimpleBlasts() {}

    doAttack(actor) {
        let app = new ApplicationBlastAttack({
            actor: actor,
        });
        app.render(true);
    }

    doActorConfig(actor) {
        new ApplicationActorConfig({}, this.actor).render(true);
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

        html.click('#ke-button-actorconfig', () => this.doActorConfig(this.actor));
        html.click('#ke-button-attack', () => this.doAttack(this.actor));
    }
}
