import { ns } from '../lib/config';
import { serializeForm } from '../lib/common';
import { ApplicationCustomTransformHelp } from './ApplicationCustomTransformHelp';
import {getSetting, setSetting} from "../lib/util";
import type {UtilityTalentConfig} from "#ke/types/utilityTalents";

export class ApplicationCustomUtility extends Application {
    parent: any;
    defaultData: any;
    key = 'customUtilityTalents';

    constructor(config: any) {
        super({
            classes: [ns],
            template: `modules/${ns}/templates/custom-utility.hbs`,
            popOut: true,
            resizable: true,
            width: 600,
            height: 800,
            id: `ke-add-custom-utility`,
            title: `Add Custom Utility Talent`,
        });
        // @ts-ignore
        this.defaultData = config.defaultData ?? {};
    }

    async close(options?: Application.CloseOptions): Promise<void> {
        return super.close(options);
    }

    getData() {
        return foundry.utils.mergeObject(super.getData(), {
            defaultData: this.defaultData,
        });
    }

    async _updateObject(event: JQuery.ClickEvent): Promise<void> {
        event.preventDefault();

        const formData = serializeForm('custom-utility') as UtilityTalentConfig;

        // Normalize and validate the new ID
        let newId = (formData.id ?? '').trim();
        if (!newId || newId.length < 3) newId = 'default';

        // Load existing utilities
        const existing = getSetting(this.key) as Record<string, UtilityTalentConfig>;

        // If we are editing an existing utility and the ID changed, remove the old entry
        const oldId = this?.defaultData?.id;
        if (oldId && oldId !== newId && existing['id']) {
            delete existing[oldId];
        }

        // Save under the new ID
        formData.id = newId;
        existing[newId] = formData;
        await setSetting(this.key, existing);
        await this.close();
    }

    /**
     * Opens a help dialog for the transform functions.
     * @param {JQuery.ClickEvent} event - The jQuery click event.
     * @returns {Promise<void>} - A promise that resolves after rendering the dialog.
     */
    async openHelpDialog(event: JQuery.ClickEvent): Promise<void> {
        event.preventDefault();
        new ApplicationCustomTransformHelp().render(true);
    }

    activateListeners(html: JQuery): void {
        super.activateListeners(html);
        html.on('click', '#save-custom', (e: JQuery.ClickEvent) => this._updateObject(e));
        html.on('click', '#transform-help', (e: JQuery.ClickEvent) => this.openHelpDialog(e));
    }
}
