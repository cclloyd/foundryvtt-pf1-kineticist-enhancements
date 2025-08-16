import {ns} from '../lib/config';
import {formInfusions} from '../lib/generated/formInfusions';
import {substanceInfusions} from '../lib/generated/substanceInfusions';
import {simpleBlastsAsArray} from '../lib/generated/simpleBlasts';
import {bundledUtilityTalents, utilityTalents} from '../lib/generated/utilityTalents';
import {ApplicationCustomInfusion} from './ApplicationCustomInfusion';
import {metakinesis} from '../lib/generated/metakinesis';
import {SettingsCustomInfusions} from './SettingsCustomInfusions';
import {SettingsCustomBlasts} from './SettingsCustomBlasts';
import {SettingsCustomUtilities} from './SettingsCustomUtilities';
import {SettingsCustomMetakinesis} from './SettingsCustomMetakinesis';
import {SettingsCustomFeats} from './SettingsCustomFeats';
import type {KineticistActorConfig} from "#ke/types/actor";
import {getSetting} from "#ke/module/lib/util";
import type {FormInfusionConfig, SubstanceInfusionConfig} from "#ke/types/infusions";
import type {FeatConfig} from "#ke/types/feats";
import type {UtilityTalentConfig} from "#ke/types/utilityTalents";
import type {MetakinesisConfig} from "#ke/types/metakinesis";
import type {BlastConfig} from "#ke/types/blasts";
import {feats, mythicFeats} from "#ke/module/lib/blastData/feats";

export class ApplicationActorConfig extends FormApplication {
    _onSettingUpdate: Function;
    actor: Actor;

    constructor(config: any = {}) {
        super(config);
        this.actor = config.actor;

        // Re-render when any setting in our module namespace changes
        this._onSettingUpdate = (setting: any) => {
            try {
                const namespace = setting?.namespace ?? setting?.module;
                if (namespace === ns) this.render(true); // force full re-render so templates fully refresh
            } catch (err) {
                // If anything goes wrong, attempt a re-render anyway
                this.render(true);
            }
        };
        // @ts-ignore
        Hooks.on('updateSetting', this._onSettingUpdate);
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
            tabs: [{navSelector: '.ke-setup-tabs', contentSelector: '.ke-setup-body', initial: 'blastsconfig'}],
        });
    }

    async close(options: Application.CloseOptions) {
        if (this._onSettingUpdate) { // @ts-ignore
            Hooks.off('updateSetting', this._onSettingUpdate);
        }
        return super.close(options);
    }

    getData() {
        const defaultActorConfig = {
            simple: [],
            form: [],
            substance: [],
            utility: [],
            feats: [],
            metakinesis: [],
            mythicFeats: [],
            autofeats: false,
        } as KineticistActorConfig;
        // @ts-ignore
        let actorConfig = this.actor.getFlag(ns, 'actorConfig') as KineticistActorConfig;
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
        const allCustomBlasts = getSetting('customBlasts') as Record<string, BlastConfig>;
        let allCustomSimpleBlasts = Object.fromEntries(
            Object.entries(allCustomBlasts).filter(([key, value]) => value.class === 'simple'),
        );
        let allCustomCompositeBlasts = Object.fromEntries(
            Object.entries(allCustomBlasts).filter(([key, value]) => value.class === 'composite'),
        );
        for (let key of Object.keys(allCustomSimpleBlasts))
            allCustomSimpleBlasts[key].owned =
                actorConfig.simple?.indexOf(allCustomSimpleBlasts[key].id) > -1 ? 'checked' : '';

        // Set owned form infusions
        let allFormInfusionTalents = formInfusions;
        for (let key of Object.keys(allFormInfusionTalents)) {
            allFormInfusionTalents[key].owned =
                actorConfig.form.indexOf(allFormInfusionTalents[key].id) > -1 ? 'checked' : '';
        }

        // Set owned custom form infusions
        const allCustomFormInfusions = getSetting('customFormInfusions') as Record<string, FormInfusionConfig>;
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
        const allCustomSubstanceInfusions = getSetting('customSubstanceInfusions') as Record<string, SubstanceInfusionConfig>;
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
        const allCustomUtilityTalents = getSetting('customUtilityTalents') as Record<string, UtilityTalentConfig>;
        for (let key of Object.keys(allCustomUtilityTalents)) {
            allCustomUtilityTalents[key].owned =
                actorConfig.utility?.indexOf(allCustomUtilityTalents[key].id) > -1 ? 'checked' : '';
        }

        // Set owned bundled utility talents
        const allBundledUtilityTalents = bundledUtilityTalents;
        for (let key of Object.keys(allBundledUtilityTalents)) {
            allBundledUtilityTalents[key].owned =
                actorConfig.utility?.indexOf(allBundledUtilityTalents[key].id) > -1 ? 'checked' : '';
        }

        // Set owned custom metakinesis
        const allCustomMetakinesis = getSetting('customMetakinesis') as Record<string, MetakinesisConfig>;
        for (let key of Object.keys(allCustomMetakinesis)) {
            allCustomMetakinesis[key].owned =
                actorConfig.metakinesis?.indexOf(allCustomMetakinesis[key].id) > -1 ? 'checked' : '';
        }

        // Determine owned feats from actor items and from saved actor flags
        const actorFeats = (this.actor.items ?? [])
            .filter((item) => {
                const tag = item?.system?.tag;
                return (
                    (typeof tag === 'string' && (tag.startsWith('feat_') || tag.startsWith('classFeat_'))) ||
                    item?.system?.type === 'feat'
                );
            })
            .map((item) => item?.system?.tag)
            .filter((tag) => typeof tag === 'string' && tag.length > 0);
        const normalize = (t) => (t + '').replace(/^(feat_|classFeat_)/, '');
        const itemOwnedFeatIdSet = new Set(actorFeats.map((t) => normalize(t)));

        // Read feats saved on actor flags (these should remain toggleable)
        const savedFeats = Array.isArray(actorConfig.feats) ? actorConfig.feats : [];
        const savedMythic = Array.isArray(actorConfig.mythicFeats) ? actorConfig.mythicFeats : [];
        const flagOwnedFeatIdSet = new Set(savedFeats.map((t) => normalize(t)));
        const flagOwnedMythicIdSet = new Set(savedMythic.map((t) => normalize(t)));

        // Set owned feats (core feats list) with forced flag if owned by item
        let allFeats = feats;
        for (let key of Object.keys(allFeats)) {
            const keyNorm = normalize(key);
            const idNorm = normalize(allFeats[key]?.id ?? key);
            const itemOwned = itemOwnedFeatIdSet.has(keyNorm) || itemOwnedFeatIdSet.has(idNorm);
            const flagOwned = flagOwnedFeatIdSet.has(keyNorm) || flagOwnedFeatIdSet.has(idNorm);
            allFeats[key].owned = itemOwned || flagOwned ? 'checked' : '';
            allFeats[key].forced = !!itemOwned;
        }

        // Set owned custom feats
        const allCustomFeats = getSetting('customFeats') as Record<string, FeatConfig>;
        for (let key of Object.keys(allCustomFeats)) {
            const customId = (allCustomFeats[key]?.id ?? key) + '';
            const customNorm = normalize(customId);
            const itemOwned = itemOwnedFeatIdSet.has(customNorm);
            const flagOwned = flagOwnedFeatIdSet.has(customNorm);
            allCustomFeats[key].owned = itemOwned || flagOwned ? 'checked' : '';
            allCustomFeats[key].forced = !!itemOwned;
        }

        // Set owned mythic feats (determine from actor items like other feats)
        let allMythicFeats = mythicFeats;
        for (let key of Object.keys(allMythicFeats)) {
            const keyNorm = normalize(key + '');
            const idNorm = normalize((allMythicFeats[key]?.id ?? key) + '');
            const itemOwned = itemOwnedFeatIdSet.has(keyNorm) || itemOwnedFeatIdSet.has(idNorm);
            const flagOwned = flagOwnedMythicIdSet.has(keyNorm) || flagOwnedMythicIdSet.has(idNorm);
            allMythicFeats[key].owned = itemOwned || flagOwned ? 'checked' : '';
            allMythicFeats[key].forced = !!itemOwned;
        }

        return foundry.utils.mergeObject(super.getData(), {
            actor: this.actor,
            simpleBlasts: allSimple,
            customSimpleBlasts: allCustomSimpleBlasts,
            customCompositeBlasts: allCustomCompositeBlasts,
            formInfusions: allFormInfusionTalents,
            customFormInfusions: allCustomFormInfusions,
            customSubstanceInfusions: allCustomSubstanceInfusions,
            substanceInfusions: allSubstanceInfusionTalents,
            utilityTalents: allUtilityTalents,
            customUtilityTalents: allCustomUtilityTalents,
            bundledUtilityTalents: allBundledUtilityTalents,
            metakinesis: metakinesis,
            customMetakinesis: allCustomMetakinesis,
            feats: allFeats,
            customFeats: allCustomFeats,
            mythicFeats: allMythicFeats,
        });
    }

    async _updateObject(event: Event, formData: any) {
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

        // Save bundled utility talents
        for (let key in formData)
            if (key.startsWith('bundled-utility-') && formData[key]?.length > 1) ownedUtility.push(key.substring(16));

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
            autofeats: false,
        };
        // @ts-ignore
        await this.actor.unsetFlag(ns, 'actorConfig');
        // @ts-ignore
        await this.actor.setFlag(ns, 'actorConfig', actorConfig);
    }

    openCustomFormInfusion() {
        let app = new ApplicationCustomInfusion({ parent: this });
        app.render(true);
    }

    async deleteCustomFormInfusion(event: JQuery.ClickEvent, formId: string) {
        event.preventDefault();
        const infusion = getSetting(`customFormInfusions.${formId}`) as FormInfusionConfig;
        new Dialog({
            title: `Confirm Delete ${infusion.name}`,
            content: `<p>Are you sure you want to delete ${infusion.name}</p>`,
            buttons: {
                yes: {
                    icon: '<i class="fas fa-check"></i>',
                    label: 'Yes',
                    callback: async () => {
                        // @ts-ignore
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

    async editCustomFormInfusion(event: JQuery.ClickEvent, formId: string) {
        event.preventDefault();
        // @ts-ignore
        const defaultData = this.actor.getFlag(ns, `customFormInfusions.${formId}`) ?? {};
        const app = new ApplicationCustomInfusion({ parent: this, actor: this.actor, defaultData });
        app.render(true);
    }

    openCustomBlastsSettings(e: JQuery.ClickEvent) {
        e.preventDefault();
        let app = new SettingsCustomBlasts({}, this.actor);
        app.render(true);
    }

    openCustomInfusionSettings(e: JQuery.ClickEvent) {
        e.preventDefault();
        let app = new SettingsCustomInfusions({}, this.actor);
        app.render(true);
    }

    openCustomUtilitySettings(e: JQuery.ClickEvent) {
        e.preventDefault();
        let app = new SettingsCustomUtilities({}, this.actor);
        app.render(true);
    }

    openCustomMetakinesisSettings(e: JQuery.ClickEvent) {
        e.preventDefault();
        let app = new SettingsCustomMetakinesis({}, this.actor);
        app.render(true);
    }

    openCustomFeatsSettings(e: JQuery.ClickEvent) {
        e.preventDefault();
        let app = new SettingsCustomFeats({}, this.actor);
        app.render(true);
    }

    _onTabChanged(tab: string) {
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

    activateListeners(html: JQuery) {
        super.activateListeners(html);
        html.on('click', '#add-custom-infusion', () => this.openCustomFormInfusion());
        html.on('click', '#open-custom-blasts', this.openCustomBlastsSettings);
        html.on('click', '#open-custom-infusions', this.openCustomInfusionSettings);
        html.on('click', '#open-custom-utility', this.openCustomUtilitySettings);
        html.on('click', '#open-custom-metakinesis', this.openCustomMetakinesisSettings);
        html.on('click', '#open-custom-feats', this.openCustomFeatsSettings);
        html.on('click', '.ke-setup-tabs a.item', (event: JQuery.ClickEvent) => {
            const tab = $(event.currentTarget).attr('data-tab');
            this._onTabChanged(tab!);
        });
        // Set initial tab button
        let initialTab =
            html.find('.ke-setup-tabs a.item.active').attr('data-tab') ||
            html.find('.ke-setup-body .tab:visible').attr('data-tab') ||
            this.options?.tabs?.[0]?.initial ||
            'blastsconfig';
        this._onTabChanged(initialTab);

        const allCustomFormInfusions = getSetting('customFormInfusions') as Record<string, FormInfusionConfig>;
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
