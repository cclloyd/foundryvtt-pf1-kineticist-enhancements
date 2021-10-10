import { ns } from '../lib/config';
import { getAllBlastsFromActor, getSimpleBlasts, jquery } from '../lib/common';
import { ApplicationActorConfig } from './ApplicationActorConfig';

export class ApplicationBlastAttack extends FormApplication {
    constructor(options = {}) {
        super(options);
        this.actor = options.actor;
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
            id: `ke-blast-attack`,
            classes: [ns],
            template: `modules/${ns}/templates/blast-attack.hbs`,
            width: 400,
            height: 500,
            title: 'Kinetic Blast Attack',
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
        const blasts = getAllBlastsFromActor(this.actor);
        return foundry.utils.mergeObject(super.getData(), {
            blasts: blasts,
            actor: this.actor,
        });
    }

    _updateObject(event, formData) {
        console.debug('formData', formData);
        const lvl = this.actor.data.data.classes.kineticist.level;

        //const items = this.actor.getEmbeddedDocument('pf1.Item', 'Energy Kinetic Blast');
        const items = this.actor.items.filter((o) => {
            return o.type === 'feat';
        });
        console.log(items);
        console.log('actor', this.actor);
        let item = this.actor.createEmbeddedDocuments('Item', [
            {
                type: 'pf1.Item',
                name: 'KE Managed Blast',
            },
        ]);
        console.log('new item', item);

        renderTemplate(`modules/${ns}/templates/partials/blast-attack-card.hbs`, {
            actor: this.actor,
        }).then((content) => {
            const messageData = {
                // CONST.CHAT_MESSAGE_TYPES OTHER: 0, OOC: 1, IC: 2, EMOTE: 3, WHISPER: 4, ROLL: 5
                type: CONST.CHAT_MESSAGE_TYPES.IC,
                //content: `${lvl}`,
                content: content,
            };
            //const items = data.actor.getEmbeddedDocument('pf1.Item', 'Energy Kinetic Blast');

            //ChatMessage.create(messageData);
        });
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
    }
}
