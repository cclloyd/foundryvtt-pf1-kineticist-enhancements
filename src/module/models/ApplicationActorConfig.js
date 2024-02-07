import { ns } from '../lib/config';
import { formInfusions } from '../lib/generated/formInfusions';
import { substanceInfusions } from '../lib/generated/substanceInfusions';
import { simpleBlasts, simpleBlastsAsArray } from '../lib/generated/simpleBlasts';
import { utilityTalents } from '../lib/generated/utilityTalents';
import { feats, mythicFeats } from '../lib/blastData/feats';

export class ApplicationActorConfig extends FormApplication {
    constructor(options = {}, actor = null) {
        super(options);
        this.actor = actor;
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: `ke-actor-config`,
            classes: [ns],
            template: `modules/${ns}/templates/actor-config.hbs`,
            popOut: true,
            resizable: true,
            width: 600,
            height: 700,
            title: 'Kineticist Enhanced Actor Configuration',
            tabs: [{ navSelector: '.ke-setup-tabs', contentSelector: '.ke-setup-body', initial: 'featconfig' }],
        });
    }

    async close(options) {
        return super.close(options);
    }

    getData() {
        const defaultActorConfig = {
            simple: [],
            form: [],
            substance: [],
            utility: [],
            feats: [],
            mythicFeats: [],
            autofeats: false,
        };
        let actorConfig = this.actor.getFlag(ns, 'actorConfig');
        // Use default if not set on actor yet
        if (!actorConfig) actorConfig = defaultActorConfig;

        // Make sure all keys exist on config object and are correct type
        for (let key in defaultActorConfig) {
            if (actorConfig[key] === undefined) actorConfig[key] = defaultActorConfig[key];
            if (actorConfig[key].constructor.name !== defaultActorConfig[key].constructor.name)
                actorConfig[key] = defaultActorConfig[key];
        }

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
            }
        }

        // Set owned form infusions
        let allFormInfusionTalents = formInfusions;
        for (let key of Object.keys(allFormInfusionTalents)) {
            allFormInfusionTalents[key].owned =
                actorConfig.form.indexOf(allFormInfusionTalents[key].id) > -1 ? 'checked' : '';
        }

        // Set owned substance infusions
        let allSubstanceInfusionTalents = substanceInfusions;
        for (let key of Object.keys(allSubstanceInfusionTalents)) {
            allSubstanceInfusionTalents[key].owned =
                actorConfig.substance.indexOf(allSubstanceInfusionTalents[key].id) > -1 ? 'checked' : '';
        }

        // Set owned utility talents
        let allUtilityTalents = utilityTalents;
        for (let key of Object.keys(allUtilityTalents)) {
            allUtilityTalents[key].owned = actorConfig.utility.indexOf(allUtilityTalents[key].id) > -1 ? 'checked' : '';
        }

        // Set owned feats
        let allFeats = feats;
        for (let key of Object.keys(allFeats)) {
            allFeats[key].owned = actorConfig.feats.indexOf(allFeats[key].id) > -1 ? 'checked' : '';
        }

        // Set owned mythic feats
        let allMythicFeats = mythicFeats;
        for (let key of Object.keys(allMythicFeats)) {
            allMythicFeats[key].owned = actorConfig.mythicFeats.indexOf(allMythicFeats[key].id) > -1 ? 'checked' : '';
        }

        return foundry.utils.mergeObject(super.getData(), {
            actor: this.actor,
            simpleBlasts: allSimple,
            utilityTalents: allUtilityTalents,
            formInfusions: allFormInfusionTalents,
            substanceInfusions: allSubstanceInfusionTalents,
            feats: allFeats,
            mythicFeats: allMythicFeats,
        });
    }

    async _updateObject(event, formData) {
        // TODO: Unselected talents are not properly being saved as unselected.
        console.debug('KE formData', formData);
        await this.actor.unsetFlag(ns, 'actorConfig');

        // Save simple blasts
        const ownedSimple = [];
        for (let key in formData) if (key.startsWith('simple-') && formData[key]) ownedSimple.push(key.substring(7));

        // Save form infusions
        const ownedForm = [];
        for (let key in formData)
            if (key.startsWith('form-') && formData[key]?.length > 1) ownedForm.push(key.substring(5));

        // Save substance infusions
        const ownedSubstance = [];
        for (let key in formData)
            if (key.startsWith('substance-') && formData[key]) ownedSubstance.push(key.substring(10));

        // Save utility talents
        const ownedUtility = [];
        for (let key in formData) if (key.startsWith('utility-') && formData[key]) ownedUtility.push(key.substring(8));

        // Save feats
        const ownedFeats = [];
        for (let key in formData) if (key.startsWith('feat-') && formData[key]) ownedFeats.push(key.substring(5));

        // Save mythic feats
        const ownedMythicFeats = [];
        for (let key in formData)
            if (key.startsWith('mythicFeat-') && formData[key]) ownedMythicFeats.push(key.substring(11));

        const actorConfig = {
            simple: ownedSimple,
            form: ownedForm,
            substance: ownedSubstance,
            utility: ownedUtility,
            feats: ownedFeats,
            mythicFeats: ownedMythicFeats,
            autofeats: false, // TODO: add boolean to automatically calculate feats from features tab
        };
        await this.actor.setFlag(ns, 'formData', formData);
        console.log('formData', formData);
        console.log('actorConfig', actorConfig);
        await this.actor.setFlag(ns, 'actorConfig', actorConfig);

        // Mark actor setup completed if not setup before
        if (!this.actor.getFlag(ns, 'firstSetupCompleted')) await this.actor.setFlag(ns, 'firstSetupCompleted', true);
        // TODO: Application requires you to unselect token once to refresh after configuring for first time.
    }

    activateListeners(html) {
        super.activateListeners(html);
        //html.on(jquery.click, '.save-config-button', this.upd);
    }
}
