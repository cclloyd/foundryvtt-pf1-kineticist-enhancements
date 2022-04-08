import { ns } from '../lib/config';
import { formInfusions } from '../lib/generated/formInfusions';
import { substanceInfusions } from '../lib/generated/substanceInfusions';
import { simpleBlasts, simpleBlastsAsArray } from '../lib/generated/simpleBlasts';
import { utilityTalents } from '../lib/generated/utilityTalents';

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
            popOut: true,
            resizable: true,
            width: 500,
            height: 700,
            title: 'Kineticist Enhanced Actor Configuration',
            tabs: [{ navSelector: '.ke-setup-tabs', contentSelector: '.ke-setup-body', initial: 'blastsconfig' }],
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

        // Get all simple blasts with `owned = false`
        const allSimple = simpleBlastsAsArray(true).map((i) => {
            i.owned = '';
            return i;
        });

        // Set which blasts are owned
        for (let o of owned) {
            const index = allSimple.map((e) => e.id).indexOf(o);
            if (allSimple[index]) {
                allSimple[index].owned = 'checked';
                console.log(allSimple[index]);
            }
        }

        // Set owned form infusions
        let ownedFormInfusions = this.actor.getFlag(ns, 'formInfusions') ?? [];
        let allFormInfusionTalents = formInfusions;
        for (let key of Object.keys(allFormInfusionTalents)) {
            allFormInfusionTalents[key].owned =
                ownedFormInfusions?.indexOf(allFormInfusionTalents[key].id) > -1 ? 'checked' : '';
        }

        // Set owned substance infusions
        let ownedSubstanceInfusions = this.actor.getFlag(ns, 'substanceInfusions') ?? [];
        let allSubstanceInfusionTalents = substanceInfusions;
        for (let key of Object.keys(allSubstanceInfusionTalents)) {
            allSubstanceInfusionTalents[key].owned =
                ownedSubstanceInfusions?.indexOf(allSubstanceInfusionTalents[key].id) > -1 ? 'checked' : '';
        }

        // Set owned utility talents
        let ownedUtilityTalents = this.actor.getFlag(ns, 'utilityTalents') ?? [];
        let allUtilityTalents = utilityTalents;
        for (let key of Object.keys(allUtilityTalents)) {
            allUtilityTalents[key].owned =
                ownedUtilityTalents?.indexOf(allUtilityTalents[key].id) > -1 ? 'checked' : '';
        }

        return foundry.utils.mergeObject(super.getData(), {
            actor: this.actor,
            simpleBlasts: allSimple,
            utilityTalents: allUtilityTalents,
            formInfusions: allFormInfusionTalents,
            substanceInfusions: allSubstanceInfusionTalents,
        });
    }

    _updateObject(event, formData) {
        console.debug('KE formData', formData);
        // Save simple blasts
        const ownedSimple = [];
        for (let key in formData) if (key.startsWith('simple-') && formData[key]) ownedSimple.push(key.substring(7));
        this.actor.setFlag(ns, 'simpleBlasts', ownedSimple);

        // Save form infusions
        const ownedForm = [];
        for (let key in formData) if (key.startsWith('form-') && formData[key]) ownedForm.push(key.substring(5));
        this.actor.setFlag(ns, 'formInfusions', ownedForm);

        // Save substance infusions
        const ownedSubstance = [];
        for (let key in formData)
            if (key.startsWith('substance-') && formData[key]) ownedSubstance.push(key.substring(10));
        this.actor.setFlag(ns, 'substanceInfusions', ownedSubstance);

        // Save utility talents
        const ownedUtility = [];
        for (let key in formData) if (key.startsWith('utility-') && formData[key]) ownedUtility.push(key.substring(8));
        this.actor.setFlag(ns, 'utilityTalents', ownedUtility);

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
        //html.on(jquery.click, '.save-config-button', this.upd);
    }
}
