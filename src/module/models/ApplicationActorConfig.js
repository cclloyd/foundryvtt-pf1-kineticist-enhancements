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

    async close(options) {
        return super.close(options);
    }

    getData() {
        let actorConfig = this.actor.getFlag(ns, 'actorConfig');
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

        return foundry.utils.mergeObject(super.getData(), {
            actor: this.actor,
            simpleBlasts: allSimple,
            utilityTalents: allUtilityTalents,
            formInfusions: allFormInfusionTalents,
            substanceInfusions: allSubstanceInfusionTalents,
        });
    }

    async _updateObject(event, formData) {
        // TODO: Unselected talents are not properly being saved as unselected.
        console.debug('KE formData', formData);
        await this.actor.unsetFlag(ns, 'actorConfig');

        // Save simple blasts
        const ownedSimple = [];
        for (let key in formData) if (key.startsWith('simple-') && formData[key]) ownedSimple.push(key.substring(7));
        //this.actor.setFlag(ns, 'simpleBlasts', ownedSimple);

        // Save form infusions
        const ownedForm = [];
        for (let key in formData)
            if (key.startsWith('form-') && formData[key]?.length > 1) ownedForm.push(key.substring(5));
        //this.actor.setFlag(ns, 'formInfusions', ownedForm);

        // Save substance infusions
        const ownedSubstance = [];
        for (let key in formData)
            if (key.startsWith('substance-') && formData[key]) ownedSubstance.push(key.substring(10));
        //this.actor.setFlag(ns, 'substanceInfusions', ownedSubstance);

        // Save utility talents
        const ownedUtility = [];
        for (let key in formData) if (key.startsWith('utility-') && formData[key]) ownedUtility.push(key.substring(8));
        //this.actor.setFlag(ns, 'utilityTalents', ownedUtility);

        const actorConfig = {
            simple: ownedSimple,
            form: ownedForm,
            substance: ownedSubstance,
            utility: ownedUtility,
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
