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
            width: 800,
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
        // Get list of all wild talents and owned wild talents and compare
        let ownedSimpleIDs = this.actor.getFlag(ns, 'simpleBlasts');
        // Populate and set flag if not yet defined.
        if (ownedSimpleIDs === undefined) {
            this.actor.setFlag(ns, 'simpleBlasts', []);
            ownedSimpleIDs = [];
        }
        // Set owned talents
        let allSimpleBlasts = getSimpleBlasts();
        let ownedSimpleBlasts = [];
        for (let key of Object.keys(allSimpleBlasts)) {
            if (ownedSimpleIDs.indexOf(allSimpleBlasts[key].id) > -1) ownedSimpleBlasts.push(allSimpleBlasts[key]);
        }

        return foundry.utils.mergeObject(super.getData(), {
            blasts: ownedSimpleBlasts,
            compositeblasts: this.getCompositeBlasts(),
            kineticists: this.getKineticistActors(),
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
