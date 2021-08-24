import { ns } from '../lib/config';
import { getSimpleBlasts } from '../lib/common';

export class SetupApplication extends Application {
    constructor(options = {}) {
        super(options);
    }

    /**
     * Default Application options
     *
     * @returns {object} options - Application options.
     * @see https://foundryvtt.com/api/Application.html#options
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: `${ns}_setup`,
            classes: [ns],
            template: `modules/${ns}/templates/setup.hbs`,
            width: 700,
            height: 600,
            title: 'Kineticist Enhanced Setup',
            tabs: [{ navSelector: '.ke-setup-tabs', contentSelector: '.ke-setup-body', initial: 'blastconfig' }],
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
