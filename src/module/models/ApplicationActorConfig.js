import { ns } from '../lib/config';
import { getSimpleBlasts, getCompositeBlasts, jquery } from '../lib/common';

export class ApplicationActorConfig extends FormApplication {
    constructor(options = {}) {
        const { actor, ...other } = options;
        super(other);
        if (actor) this.actor = actor;
        CONFIG.debug.hooks = false;
        console.log('this', this);
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

        const composite = getCompositeBlasts(owned);
        owned = this.actor.getFlag(ns, 'compositeBlasts');
        if (owned === undefined) owned = [];
        const allComposite = [];
        for (let blast of composite) {
            let isOwned = false;
            for (let b of owned) {
                if (b === blast.id) {
                    isOwned = true;
                    break;
                }
            }
            allComposite.push({
                blast: blast,
                isOwned: isOwned ? 'checked' : '',
            });
        }
        console.log('allComposite', allComposite);

        const blasts = {
            simple: allSimple,
            composite: allComposite,
        };

        console.log('composite', composite);

        return foundry.utils.mergeObject(super.getData(), {
            actor: this.actor,
            blasts: blasts,
        });
    }

    saveSimpleBlasts() {}

    _updateObject(event, formData) {
        console.debug('formData', formData);
        let blasts = [];
        for (let key in formData) {
            if (key.startsWith('simple-')) {
                blasts.push(key);
            }
        }
        const simpleBlasts = [];
        for (let key of blasts) {
            if (formData[key]) simpleBlasts.push(key.substring(7));
        }
        this.actor.setFlag(ns, 'simpleBlasts', simpleBlasts);
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
