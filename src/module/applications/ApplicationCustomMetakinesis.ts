import {ns} from '../lib/config';
import {serializeForm} from '../lib/common';
import {ApplicationCustomTransformHelp} from './ApplicationCustomTransformHelp';
import type {MetakinesisConfig} from "#ke/types/metakinesis";
import {getSetting, setSetting} from "#ke/module/lib/util";

export class ApplicationCustomMetakinesis extends Application {
    key = 'customBlasts';
    parent: any;
    defaultData?: MetakinesisConfig;

    constructor(config: any) {
        super({
            classes: [ns],
            template: `modules/${ns}/templates/custom-metakinesis.hbs`,
            popOut: true,
            resizable: true,
            width: 600,
            height: 600,
            id: `ke-add-custom-metakinesis`,
            title: `Add Custom Metakinesis`,
        });
        this.parent = config.parent;
        this.defaultData = config.defaultData ?? {};
        this.key = 'customMetakinesis';
    }

    async close(options: Application.CloseOptions) {
        return super.close(options);
    }

    async getSavedCustomItems() {
        return await getSetting(this.key) as Record<string, MetakinesisConfig>
    }

    getData() {
        return foundry.utils.mergeObject(super.getData(), {
            defaultData: this.defaultData,
        });
    }

    async _updateObject(event: Event) {
        event.preventDefault();

        const formData = serializeForm('custom-metakinesis') as MetakinesisConfig;

        // Normalize and validate the new ID
        let newId = (formData.id ?? '').trim();
        if (!newId || newId.length < 3) newId = 'default';

        // Load existing metakinesis
        const allCustom = await this.getSavedCustomItems();

        // If we are editing an existing entry and the ID changed, remove the old entry
        const oldId = this?.defaultData?.id;
        if (oldId && oldId !== newId && allCustom[oldId]) {
            delete allCustom[oldId];
        }

        // Save under the new ID
        formData.id = newId;
        allCustom[newId] = formData;
        await setSetting(this.key, allCustom);
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

    async activateListeners(html: JQuery) {
        super.activateListeners(html);
        // @ts-ignore
        html.on('click', '#save-custom', (e: JQuery.ClickEvent) => this._updateObject(e));
        html.on('click', '#transform-help', (e: JQuery.ClickEvent) => this.openHelpDialog(e));
    }
}
