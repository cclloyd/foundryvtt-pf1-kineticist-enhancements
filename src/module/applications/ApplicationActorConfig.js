import { ns } from '../lib/config';
import { formInfusions } from '../lib/generated/formInfusions';
import { substanceInfusions } from '../lib/generated/substanceInfusions';
import { simpleBlasts, simpleBlastsAsArray } from '../lib/generated/simpleBlasts';
import { utilityTalents } from '../lib/generated/utilityTalents';
import { feats, mythicFeats } from '../lib/blastData/feats';
import { ApplicationCustomInfusion } from './ApplicationCustomInfusion';
import { metakinesis } from '../lib/generated/metakinesis';
import { SettingsCustomInfusions } from './SettingsCustomInfusions';
import { SettingsCustomBlasts } from './SettingsCustomBlasts';
import { SettingsCustomUtilities } from './SettingsCustomUtilities';
import { SettingsCustomMetakinesis } from './SettingsCustomMetakinesis';

export class ApplicationActorConfig extends FormApplication {
    constructor(options = {}, actor = null) {
        super(options);
        this.actor = actor;
    }
    // TODO: Add ability to import/export actor config and custom talents
    // TODO: Add suite of bundled custom utilities that are disabled by default. (2x damage, 2x area, half damage, etc)
    // TODO: Add priority to utility talents to allow executing them in specific orders.
    // TODO: Create BlastFactory class with various classes like setName(), setBlast(), etc, so that the application is just a series of function calls instead of a complicated mess

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
            tabs: [{ navSelector: '.ke-setup-tabs', contentSelector: '.ke-setup-body', initial: 'blastsconfig' }],
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

        let owned = actorConfig.simple;
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
        // Set owned custom blasts
        const allCustomBlasts = game.settings.get(ns, 'customBlasts') ?? {};
        let allCustomSimpleBlasts = Object.fromEntries(
            Object.entries(allCustomBlasts).filter(([key, value]) => value.class === 'simple'),
        );
        let allCustomCompositeBlasts = Object.fromEntries(
            Object.entries(allCustomBlasts).filter(([key, value]) => value.class === 'composite'),
        );
        for (let key of Object.keys(allCustomSimpleBlasts))
            allCustomSimpleBlasts[key].owned =
                actorConfig.simple?.indexOf(allCustomSimpleBlasts[key].id) > -1 ? 'checked' : '';
        for (let key of Object.keys(allCustomCompositeBlasts))
            allCustomCompositeBlasts[key].owned =
                actorConfig.composite?.indexOf(allCustomCompositeBlasts[key].id) > -1 ? 'checked' : '';

        // Set owned form infusions
        let allFormInfusionTalents = formInfusions;
        for (let key of Object.keys(allFormInfusionTalents)) {
            allFormInfusionTalents[key].owned =
                actorConfig.form.indexOf(allFormInfusionTalents[key].id) > -1 ? 'checked' : '';
        }

        // Set owned custom form infusions
        const allCustomFormInfusions = game.settings.get(ns, 'customFormInfusions') ?? {};
        for (let key of Object.keys(allCustomFormInfusions)) {
            allCustomFormInfusions[key].owned =
                actorConfig.form?.indexOf(allCustomFormInfusions[key].id) > -1 ? 'checked' : '';
        }

        // Set owned substance infusions
        let allSubstanceInfusionTalents = substanceInfusions;
        for (let key of Object.keys(allSubstanceInfusionTalents)) {
            allSubstanceInfusionTalents[key].owned =
                actorConfig.substance?.indexOf(allSubstanceInfusionTalents[key].id) > -1 ? 'checked' : '';
        }

        // Set owned custom substance infusions
        const allCustomSubstanceInfusions = game.settings.get(ns, 'customSubstanceInfusions') ?? {};
        for (let key of Object.keys(allCustomSubstanceInfusions)) {
            allCustomSubstanceInfusions[key].owned =
                actorConfig.substance?.indexOf(allCustomSubstanceInfusions[key].id) > -1 ? 'checked' : '';
        }

        // Set owned utility talents
        let allUtilityTalents = utilityTalents;
        for (let key of Object.keys(allUtilityTalents)) {
            allUtilityTalents[key].owned =
                actorConfig.utility?.indexOf(allUtilityTalents[key].id) > -1 ? 'checked' : '';
        }

        // Set owned custom utility talents
        const allCustomUtilityTalents = game.settings.get(ns, 'customUtilityTalents') ?? {};
        for (let key of Object.keys(allCustomUtilityTalents)) {
            allCustomUtilityTalents[key].owned =
                actorConfig.utility?.indexOf(allCustomUtilityTalents[key].id) > -1 ? 'checked' : '';
        }

        // Set owned custom metakinesis
        const allCustomMetakinesis = game.settings.get(ns, 'customMetakinesis') ?? {};
        for (let key of Object.keys(allCustomMetakinesis)) {
            allCustomMetakinesis[key].owned =
                actorConfig.metakinesis?.indexOf(allCustomMetakinesis[key].id) > -1 ? 'checked' : '';
        }

        // Set owned feats
        let allFeats = feats;
        for (let key of Object.keys(allFeats)) {
            allFeats[key].owned = actorConfig.feats?.indexOf(allFeats[key].id) > -1 ? 'checked' : '';
        }

        // Set owned custom feats
        const allCustomFeats = game.settings.get(ns, 'customFeats') ?? {};
        for (let key of Object.keys(allCustomFeats)) {
            allCustomFeats[key].owned = actorConfig.feats?.indexOf(allCustomFeats[key].id) > -1 ? 'checked' : '';
        }

        // Set owned mythic feats
        let allMythicFeats = mythicFeats;
        for (let key of Object.keys(allMythicFeats)) {
            allMythicFeats[key].owned = actorConfig.mythicFeats?.indexOf(allMythicFeats[key].id) > -1 ? 'checked' : '';
        }
        return foundry.utils.mergeObject(super.getData(), {
            actor: this.actor,
            simpleBlasts: allSimple,
            formInfusions: allFormInfusionTalents,
            substanceInfusions: allSubstanceInfusionTalents,
            utilityTalents: allUtilityTalents,
            customFormInfusions: allCustomFormInfusions,
            customSubstanceInfusions: allCustomSubstanceInfusions,
            customUtilityTalents: allCustomUtilityTalents,
            customSimpleBlasts: allCustomSimpleBlasts,
            customCompositeBlasts: allCustomCompositeBlasts,
            metakinesis: metakinesis,
            customFeats: allCustomFeats,
            customMetakinesis: allCustomMetakinesis,
            feats: allFeats,
            mythicFeats: allMythicFeats,
        });
    }

    async _updateObject(event, formData) {
        event.preventDefault();

        // Save simple blasts
        const ownedSimple = [];
        for (let key in formData) if (key.startsWith('simple-') && formData[key]) ownedSimple.push(key.substring(7));

        // Save custom simple blasts
        for (let key in formData)
            if (key.startsWith('custom-simple-') && formData[key]?.length > 1) ownedSimple.push(key.substring(14));

        // Save custom simple blasts
        const ownedComposite = [];
        for (let key in formData)
            if (key.startsWith('custom-composite-') && formData[key]?.length > 1)
                ownedComposite.push(key.substring(17));

        // Save form infusions
        const ownedForm = [];
        for (let key in formData)
            if (key.startsWith('form-') && formData[key]?.length > 1) ownedForm.push(key.substring(5));

        // Save custom form infusions
        for (let key in formData)
            if (key.startsWith('custom-form-') && formData[key]?.length > 1) ownedForm.push(key.substring(12));

        // Save substance infusions
        const ownedSubstance = [];
        for (let key in formData)
            if (key.startsWith('substance-') && formData[key]) ownedSubstance.push(key.substring(10));

        // Save custom substance infusions
        for (let key in formData)
            if (key.startsWith('custom-substance-') && formData[key]?.length > 1)
                ownedSubstance.push(key.substring(17));

        // Save utility talents
        const ownedUtility = [];
        for (let key in formData) if (key.startsWith('utility-') && formData[key]) ownedUtility.push(key.substring(8));

        // Save custom utility talents
        for (let key in formData)
            if (key.startsWith('custom-utility-') && formData[key]?.length > 1) ownedUtility.push(key.substring(15));

        // Save custom metakinesis
        const ownedMetakinesis = [];
        for (let key in formData)
            if (key.startsWith('custom-metakinesis-') && formData[key]?.length > 1)
                ownedMetakinesis.push(key.substring(19));

        // Save feats
        const ownedFeats = [];
        for (let key in formData) if (key.startsWith('feat-') && formData[key]) ownedFeats.push(key.substring(5));

        // Save custom feats
        for (let key in formData)
            if (key.startsWith('custom-feat-') && formData[key]?.length > 1) ownedFeats.push(key.substring(12));

        // Save mythic feats
        const ownedMythicFeats = [];
        for (let key in formData)
            if (key.startsWith('mythicFeat-') && formData[key]) ownedMythicFeats.push(key.substring(11));

        const actorConfig = {
            simple: ownedSimple,
            composite: ownedComposite,
            form: ownedForm,
            substance: ownedSubstance,
            utility: ownedUtility,
            feats: ownedFeats,
            mythicFeats: ownedMythicFeats,
            metakinesis: ownedMetakinesis,
            autofeats: false, // TODO: add boolean to automatically calculate feats from features tab
        };
        await this.actor.unsetFlag(ns, 'actorConfig', actorConfig);
        await this.actor.setFlag(ns, 'actorConfig', actorConfig);
    }

    openCustomFormInfusion() {
        let app = new ApplicationCustomInfusion({}, this);
        app.render(true);
    }

    async deleteCustomFormInfusion(event, formId) {
        event.preventDefault();
        const infusion = await this.actor.getFlag(ns, `customFormInfusions.${formId}`);
        new Dialog({
            title: `Confirm Delete ${infusion.name}`,
            content: `<p>Are you sure you want to delete ${infusion.name}</p>`,
            buttons: {
                yes: {
                    icon: '<i class="fas fa-check"></i>',
                    label: 'Yes',
                    callback: async () => {
                        await this.actor.unsetFlag(ns, `customFormInfusions.${formId}`);
                        await this.render(false);
                    },
                },
                no: {
                    icon: '<i class="fas fa-times"></i>',
                    label: 'No',
                },
            },
            default: 'no',
        }).render(true);
    }

    async editCustomFormInfusion(event, formId) {
        event.preventDefault();
        const defaultData = this.actor.getFlag(ns, `customFormInfusions.${formId}`) ?? {};
        const app = new ApplicationCustomInfusion({}, this, defaultData);
        app.render(true);
    }

    openCustomBlastsSettings(e) {
        e.preventDefault();
        let app = new SettingsCustomBlasts({}, this.actor);
        app.render(true);
    }

    openCustomInfusionSettings(e) {
        e.preventDefault();
        let app = new SettingsCustomInfusions({}, this.actor);
        app.render(true);
    }

    openCustomUtilitySettings(e) {
        e.preventDefault();
        let app = new SettingsCustomUtilities({}, this.actor);
        app.render(true);
    }

    openCustomMetakinesisSettings(e) {
        e.preventDefault();
        let app = new SettingsCustomMetakinesis({}, this.actor);
        app.render(true);
    }

    _onTabChanged(tab) {
        const root = this.element;
        if (!root) return;
        root.find('.ke-config-custom-settings-button').css('display', 'none');

        // Try a direct id based on trimming the trailing "config"
        let id = `#open-custom-${tab.slice(0, -6)}`;
        let $btn = root.find(id);
        // Fallback: some ids use a plural form (e.g. "blasts" vs "blast")
        if ($btn.length === 0) $btn = root.find(`${id}s`);
        if ($btn.length > 0) $btn.css('display', 'inline-block');
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.on('click', '#add-custom-infusion', () => this.openCustomFormInfusion());
        html.on('click', '#open-custom-blasts', this.openCustomBlastsSettings);
        html.on('click', '#open-custom-infusions', this.openCustomInfusionSettings);
        html.on('click', '#open-custom-utility', this.openCustomUtilitySettings);
        html.on('click', '#open-custom-metakinesis', this.openCustomMetakinesisSettings);
        html.on('click', '.ke-setup-tabs a.item', (event) => {
            const tab = $(event.currentTarget).attr('data-tab');
            this._onTabChanged(tab);
        });
        // Set initial tab button
        let initialTab =
            html.find('.ke-setup-tabs a.item.active').attr('data-tab') ||
            html.find('.ke-setup-body .tab:visible').attr('data-tab') ||
            this.options?.tabs?.[0]?.initial ||
            'blastsconfig';
        this._onTabChanged(initialTab);

        const allCustomFormInfusions = this.actor.getFlag(ns, 'customFormInfusions') ?? {};
        for (let key of Object.keys(allCustomFormInfusions)) {
            html.on('click', `#custom-form-${allCustomFormInfusions[key].id}-delete`, (e) =>
                this.deleteCustomFormInfusion(e, allCustomFormInfusions[key].id),
            );
            html.on('click', `#custom-form-${allCustomFormInfusions[key].id}-edit`, (e) =>
                this.editCustomFormInfusion(e, allCustomFormInfusions[key].id),
            );
        }
    }
}
