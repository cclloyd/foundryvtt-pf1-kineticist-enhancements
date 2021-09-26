import { ns } from '../lib/config';
import { getSimpleBlasts, jquery } from '../lib/common';

export class BlastConfigApplication extends FormApplication {
    constructor(options = {}) {
        super(options);
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
            id: `blast-config-form`,
            classes: [ns],
            template: `modules/${ns}/templates/blastconfig.hbs`,
            width: 700,
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

    /**
     * @override
     * @inheritDoc
     * @see https://foundryvtt.com/api/FormApplication.html#getData
     */
    getData() {
        return foundry.utils.mergeObject(super.getData(), {
            blasts: getSimpleBlasts(),
            compositeblasts: this.getCompositeBlasts(),
        });
    }

    saveSimpleBlasts() {
        return [];
    }

    getCompositeBlasts() {
        return [];
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

        html.on(jquery.click, '.save-simple-button', this.saveSimpleBlasts);
    }

    async _updateObject(event, formData) {
        console.log('event', event);
        console.log('formData', formData);

        for (let key of Object.keys(formData)) {
            console.log('actor', formData[key]);
            console.log(game);
        }
    }
}
