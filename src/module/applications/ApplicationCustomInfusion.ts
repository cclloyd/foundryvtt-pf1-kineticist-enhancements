import {ns} from '../lib/config';
import {ApplicationCustomTransformHelp} from './ApplicationCustomTransformHelp';
import {capitalizeFirstLetter, serializeForm} from '../lib/common';
import {getSetting, setSetting} from "#ke/module/lib/util";
import type {InfusionConfig, InfusionType} from "#ke/types/infusions";

export class ApplicationCustomInfusion extends Application {
    formKey = 'customFormInfusions';
    substanceKey = 'customSubstanceInfusions';
    parent: any;
    actor: Actor;
    defaultData?: InfusionConfig;
    infusionType: InfusionType;

    constructor(config: any) {
        super({
            classes: [ns],
            template: `modules/${ns}/templates/partials/custom-infusion.hbs`,
            popOut: true,
            resizable: true,
            width: 600,
            height: 800,
            id: `custom-${config.infusionType ?? 'form'}-infusion`,
            title: `Add Custom ${capitalizeFirstLetter(config.infusionType ?? 'form')} Infusion`,
        });
        this.actor = config.actor;
        this.parent = config.parent;
        this.defaultData = config.defaultData ?? {};
        this.infusionType = config.infusionType ?? 'form';
    }

    async close(options: Application.CloseOptions) {
        return super.close(options);
    }

    async getSavedCustomItems(type: InfusionType) {
        return await getSetting(type === 'form' ? this.formKey : this.substanceKey) as Record<string, InfusionConfig>
    }

    getSettingsKey(infusionType: InfusionType) {
        if (this.infusionType === 'form' || infusionType === 'form') return this.formKey;
        return this.substanceKey;
    }

    getData() {
        return foundry.utils.mergeObject(super.getData(), {
            actor: this.actor,
            infusion: this.defaultData,
            infusionType: this.infusionType,
            infusionTypeName: this.infusionType.charAt(0).toUpperCase() + this.infusionType.slice(1),
        });
    }

    async _updateObject(event: Event) {
        event.preventDefault();

        const formData = serializeForm('custom-infusion') as InfusionConfig;

        // Normalize and validate the new ID
        let newId = (formData.id ?? '').trim();
        if (!newId || newId.length < 3) newId = 'default';

        // Load existing infusions
        const allCustom = await this.getSavedCustomItems(formData.type);

        // If we are editing an existing infusion and the ID changed, remove the old entry
        const oldId = this?.defaultData?.id;
        if (oldId && oldId !== newId && allCustom[oldId]) {
            delete allCustom[oldId];
        }

        // Save under the new ID
        formData.id = newId;
        allCustom[newId] = formData;
        await setSetting(this.getSettingsKey(formData.type), allCustom);
        if (this.parent) this.parent.render(true);
        await this.close({});
    }

    /**
     * Opens a help dialog for the transform functions.
     * @param {Event} event - The event object.
     * @returns {Promise<void>} - A promise that resolves after rendering the dialog.
     */
    async openHelpDialog(event: JQuery.ClickEvent) {
        event.preventDefault();
        new ApplicationCustomTransformHelp().render(true);
    }

    async activateListeners(html: any) {
        //super.activateListeners(html);
        // @ts-ignore
        html.on('click', '#save-custom-form-infusion', (e: JQuery.ClickEvent) => this._updateObject(e));
        html.on('click', '#transform-help', (e: JQuery.ClickEvent) => this.openHelpDialog(e));
    }
}
