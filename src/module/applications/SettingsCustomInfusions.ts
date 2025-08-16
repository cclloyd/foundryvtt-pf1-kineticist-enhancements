import { ns } from '../lib/config';
import { ApplicationCustomInfusion } from './ApplicationCustomInfusion';
import type {FormInfusionConfig, InfusionConfig, InfusionType, SubstanceInfusionConfig} from "#ke/types/infusions";
import {getSetting, setSetting} from "#ke/module/lib/util";

export class SettingsCustomInfusions extends FormApplication {
    formKey = 'customFormInfusions';
    substanceKey = 'customSubstanceInfusions';
    actor: Actor;
    _onSettingUpdate: Function;

    constructor(options = {}, actor: Actor) {
        super(options);
        this.actor = actor;

        // Listen for changes to the custom infusion settings and re-render if they change
        this._onSettingUpdate = (setting: any) => {
            try {
                const namespace = setting?.namespace ?? setting?.module;
                const key = setting?.key;
                if (namespace === ns && (key === 'customFormInfusions' || key === 'customSubstanceInfusions')) {
                    this.render(false);
                }
            } catch (err) {
                this.render(false);
            }
        };
        // @ts-ignore
        Hooks.on('updateSetting', this._onSettingUpdate);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: `settings-custom-infusions`,
            classes: [ns],
            template: `modules/${ns}/templates/custom-infusions.hbs`,
            popOut: true,
            resizable: true,
            width: 800,
            height: 400,
            title: 'Custom Infusions',
        });
    }

    async close(options: Application.CloseOptions) {
        if (this._onSettingUpdate) { // @ts-ignore
            Hooks.off('updateSetting', this._onSettingUpdate);
        }
        return super.close(options);
    }

    getSettingsKey(infusionType: InfusionType) {
        if (infusionType === 'form') return this.formKey;
        return this.substanceKey;
    }

    async getSavedCustomItems(type: InfusionType) {
        return await getSetting(type === 'form' ? this.formKey : this.substanceKey) as Record<string, InfusionConfig>
    }

    getData() {
        const allCustomFormInfusions = game.settings!.get(ns, this.formKey) as Record<string, FormInfusionConfig>;
        const allCustomSubstanceInfusions = game.settings!.get(ns, this.substanceKey) as Record<string, SubstanceInfusionConfig>;

        return {
            customFormInfusions: Object.values(allCustomFormInfusions),
            customSubstanceInfusions: Object.values(allCustomSubstanceInfusions),
        };
    }

    async _updateObject(event: Event, formData: any) {
        event.preventDefault();
        await this.close({});
    }

    openCustomInfusion(infusionType: InfusionType) {
        let app = new ApplicationCustomInfusion({ infusionType: infusionType, parent: this });
        app.render(true);
    }

    async deleteCustomInfusion(event: JQuery.ClickEvent, infusionType: InfusionType, formId: string) {
        event.preventDefault();

        const allCustom = await this.getSavedCustomItems(infusionType);
        const infusion = allCustom[formId];
        new Dialog({
            title: `Confirm Delete ${infusion.name}`,
            content: `<p>Are you sure you want to delete ${infusion.name}</p>`,
            buttons: {
                yes: {
                    icon: '<i class="fas fa-check"></i>',
                    label: 'Yes',
                    callback: async () => {
                        const infusions = await getSetting(this.getSettingsKey(infusionType));
                        delete allCustom[formId];
                        await setSetting(this.getSettingsKey(infusionType), infusions);
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

    async editCustomInfusion(event: JQuery.ClickEvent, infusionType: InfusionType, formId: string) {
        event.preventDefault();
        const allCustom = await this.getSavedCustomItems(infusionType);
        const app = new ApplicationCustomInfusion({ parent: this, defaultData: allCustom[formId] ?? null });
        app.render(true);
    }

    async activateListeners(html: any) {
        super.activateListeners(html);
        html.on('click', '#add-custom-form-infusion', () => this.openCustomInfusion('form'));
        html.on('click', '#add-custom-substance-infusion', () => this.openCustomInfusion('substance'));

        const allCustomFormInfusions = await this.getSavedCustomItems('form');
        for (let key of Object.keys(allCustomFormInfusions)) {
            html.on('click', `#custom-form-${allCustomFormInfusions[key].id}-delete`, (e: JQuery.ClickEvent) =>
                this.deleteCustomInfusion(e, 'form', allCustomFormInfusions[key].id),
            );
            html.on('click', `#custom-form-${allCustomFormInfusions[key].id}-edit`, (e: JQuery.ClickEvent) =>
                this.editCustomInfusion(e, 'form', allCustomFormInfusions[key].id),
            );
        }

        const allCustomSubstanceInfusions = await this.getSavedCustomItems('substance');
        for (let key of Object.keys(allCustomSubstanceInfusions)) {
            html.on('click', `#custom-substance-${allCustomSubstanceInfusions[key].id}-delete`, (e: JQuery.ClickEvent) =>
                this.deleteCustomInfusion(e, 'substance', allCustomSubstanceInfusions[key].id),
            );
            html.on('click', `#custom-substance-${allCustomSubstanceInfusions[key].id}-edit`, (e: JQuery.ClickEvent) =>
                this.editCustomInfusion(e, 'substance', allCustomSubstanceInfusions[key].id),
            );
        }
    }
}
