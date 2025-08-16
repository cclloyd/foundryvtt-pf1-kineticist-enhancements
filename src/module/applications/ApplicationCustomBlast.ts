import { ns } from '../lib/config';
import { serializeForm } from '../lib/common';
import { ApplicationCustomTransformHelp } from './ApplicationCustomTransformHelp';
import {getSetting, setSetting} from "#ke/module/lib/util";
import type {BlastClass, BlastConfig} from "#ke/types/blasts";

export class ApplicationCustomBlast extends Application {
    key = 'customBlasts';
    parent: any;
    blastType: BlastClass;
    defaultData: BlastConfig;

    constructor(config: any) {
        super({
            classes: [ns],
            template: `modules/${ns}/templates/custom-blast.hbs`,
            popOut: true,
            resizable: true,
            width: 600,
            height: 800,
            id: `ke-add-custom-blast`,
            title: `Add Custom Blast Talent`,
        });
        this.parent = config.parent;
        this.blastType = config.blastType ?? 'simple';
        this.defaultData = config.defaultData ?? { class: this.blastType };
    }

    async close(options: Application.CloseOptions) {
        return super.close(options);
    }

    async getSavedCustomItems() {
        return await getSetting(this.key) as Record<string, BlastConfig>
    }

    getData() {
        return foundry.utils.mergeObject(super.getData(), {
            defaultData: this.defaultData,
        });
    }

    async _updateObject(event: Event) {
        event.preventDefault();
        const formData = serializeForm('custom-blast') as BlastConfig;

        // Normalize and validate the new ID
        let newId = (formData.id ?? '').trim();
        if (!newId || newId.length < 3) newId = 'default';

        // Load existing blasts
        const allCustom = await this.getSavedCustomItems();

        // If we are editing an existing blast and the ID changed, remove the old entry
        const oldId = this?.defaultData?.id;
        if (oldId && oldId !== newId && allCustom[oldId]) {
            delete allCustom[oldId];
        }

        // Save under the new ID
        formData.id = newId;
        allCustom[newId] = formData;
        await setSetting(this.key, allCustom);

        // Re-render parent if present
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
        super.activateListeners(html);
        // @ts-ignore
        html.on('click', '#save-custom', (e: JQuery.ClickEvent) => this._updateObject(e));
        html.on('click', '#transform-help', (e: JQuery.ClickEvent) => this.openHelpDialog(e));
    }
}
