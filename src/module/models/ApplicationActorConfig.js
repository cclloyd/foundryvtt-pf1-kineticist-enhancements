import { ns } from '../lib/config';
import { getSimpleBlasts } from '../lib/common';
import { wildTalents } from '../lib/blastData/wildTalents';

export class ApplicationActorConfig extends FormApplication {
    constructor(options = {}, actor = null) {
        super(options);
        this.actor = actor;
    }

    /**
     * Default Application options
     *
     * @returns {object} options - Application options.
     * @see https://foundryvtt.com/api/Application.html#options
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: `ke-actor-config`,
            classes: [ns],
            template: `modules/${ns}/templates/actor-config.hbs`,
            width: 400,
            height: 600,
            title: 'Kineticist Enhanced Actor Configuration',
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
        let owned = this.actor.getFlag(ns, 'simpleBlasts');
        if (owned === undefined) owned = [];
        const simple = getSimpleBlasts();
        const allSimple = [];
        for (let blast of simple) {
            let isOwned = false;
            for (let b of owned) {
                if (b === blast.id) {
                    isOwned = true;
                    break;
                }
            }
            allSimple.push({
                blast: blast,
                isOwned: isOwned ? 'checked' : '',
            });
        }

        let ownedSimple = {};
        for (let blast of owned) {
            ownedSimple[blast] = true;
        }

        // Get list of all wild talents and owned wild talents and compare
        let ownedTalents = this.actor.getFlag(ns, 'wildTalents');
        // Populate and set flag if not yet defined.
        if (ownedTalents === undefined) {
            this.actor.setFlag(ns, 'wildTalents', []);
            ownedTalents = [];
        }
        // Set owned talents
        let allTalents = wildTalents;
        for (let key of Object.keys(allTalents)) {
            allTalents[key].isOwned = ownedTalents.indexOf(allTalents[key].id) > -1 ? 'checked' : '';
        }

        return foundry.utils.mergeObject(super.getData(), {
            actor: this.actor,
            simpleBlasts: allSimple,
            wildTalents: allTalents,
        });
    }

    _updateObject(event, formData) {
        console.debug('formData', formData);
        // Save simple blasts
        const simpleBlasts = [];
        for (let key in formData) if (key.startsWith('simple-') && formData[key]) simpleBlasts.push(key.substring(7));
        this.actor.setFlag(ns, 'simpleBlasts', simpleBlasts);

        // Save wild talents
        const talents = [];
        for (let key in formData) if (key.startsWith('talent-') && formData[key]) talents.push(key.substring(7));
        this.actor.setFlag(ns, 'wildTalents', talents);

        // Mark actor setup completed if not setup before
        if (!this.actor.getFlag(ns, 'firstSetupCompleted')) this.actor.setFlag(ns, 'firstSetupCompleted', true);
        // TODO: Application requires you to unselect token once to refresh after configuring for first time.
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
