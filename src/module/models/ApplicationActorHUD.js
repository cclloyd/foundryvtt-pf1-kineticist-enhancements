import { ns } from '../lib/config';
import { ApplicationBlastAttack } from './ApplicationBlastAttack';
import { ApplicationActorConfig } from './ApplicationActorConfig';
import { jquery } from '../lib/common';

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
        const buttons = [
            {
                id: 'ke-button-actorconfig',
                classes: [],
                text: 'Configs',
            },
        ];
        if (this.actor.getFlag(ns, 'firstSetupCompleted')) {
            buttons.push(
                ...[
                    {
                        id: 'ke-button-attack',
                        classes: [],
                        text: 'Blast Attack',
                    },
                ],
            );
        }
        return foundry.utils.mergeObject(super.getData(), {
            actor: this.actor,
            buttons: buttons,
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
        html.on(jquery.click, '#ke-button-actorconfig', void 0, () => this.doActorConfig(this.actor));
        html.on(jquery.click, '#ke-button-attack', void 0, () => this.doAttack(this.actor));
    }
}
