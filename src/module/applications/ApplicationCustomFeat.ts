import { ns } from '../lib/config';
import { serializeForm } from '../lib/common';
import { ApplicationCustomTransformHelp } from './ApplicationCustomTransformHelp';
import type {FeatConfig} from "#ke/types/feats";
import {getSetting, setSetting} from "#ke/module/lib/util";

export class ApplicationCustomFeat extends Application {
    key = 'customFeats';
    parent: any;
    defaultData: any;

    constructor(config: any) {
        super({
            classes: [ns],
            template: `modules/${ns}/templates/custom-feat.hbs`,
            popOut: true,
            resizable: true,
            width: 600,
            height: 800,
            id: `ke-add-custom-feat`,
            title: `Add Custom Feat`,
        });
        this.parent = config.parent;
        this.defaultData = config.defaultData ?? {};
    }

    async close(options: Application.CloseOptions = {}) {
        return super.close(options);
    }

    async getSavedCustomItems() {
        return await getSetting(this.key) as Record<string, FeatConfig>
    }

    getData() {
        return foundry.utils.mergeObject(super.getData(), {
            defaultData: this.defaultData,
        });
    }

    async _updateObject(event: Event) {
        event.preventDefault();

        const formData = serializeForm('custom-feat') as FeatConfig;

        // Normalize and validate the new ID
        let newId = (formData.id ?? '').trim();
        if (!newId || newId.length < 3) newId = 'default';

        // Load existing feats
        const allCustom = await this.getSavedCustomItems();

        // If we are editing an existing feat and the ID changed, remove the old entry
        const oldId = this?.defaultData?.id;
        if (oldId && oldId !== newId && allCustom[oldId]) {
            delete allCustom[oldId];
        }

        // Save under the new ID
        formData.id = newId;
        allCustom[newId] = formData;
        await setSetting(this.key, allCustom);
        if (this.parent) this.parent.render(true);
        await this.close();
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

    activateListeners(html: any) {
        super.activateListeners(html);
        // @ts-ignore
        html.on('click', '#save-custom', (e: JQuery.ClickEvent) => this._updateObject(e));
        html.on('click', '#transform-help', (e: JQuery.ClickEvent) => this.openHelpDialog(e));
    }
}
