import { ns } from '../lib/config';
import { serializeForm } from '../lib/common';
import { ApplicationCustomTransformHelp } from './ApplicationCustomTransformHelp';

export class ApplicationCustomBlast extends Application {
    constructor(config) {
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
        this.key = 'customBlasts';
    }

    async close(options) {
        return super.close(options);
    }

    getData() {
        return foundry.utils.mergeObject(super.getData(), {
            defaultData: this.defaultData,
        });
    }

    async _updateObject(event) {
        event.preventDefault();
        const formData = serializeForm('custom-blast');

        // Normalize and validate the new ID
        let newId = (formData.id ?? '').trim();
        if (!newId || newId.length < 3) newId = 'default';

        // Load existing blasts
        const existing = foundry.utils.duplicate(game.settings.get(ns, this.key) ?? {});

        // If we are editing an existing blast and the ID changed, remove the old entry
        const oldId = this?.defaultData?.id;
        if (oldId && oldId !== newId && existing[oldId]) {
            delete existing[oldId];
        }

        // Save under the new ID
        formData.id = newId;
        existing[newId] = formData;
        await game.settings.set(ns, this.key, existing);

        // Re-render parent if present
        if (this.parent) this.parent.render(true);
        await this.close();
    }

    /**
     * Opens a help dialog for the transform functions.
     * @param {Event} event - The event object.
     * @returns {Promise<void>} - A promise that resolves after rendering the dialog.
     */
    async openHelpDialog(event) {
        event.preventDefault();
        new ApplicationCustomTransformHelp().render(true);
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.on('click', '#save-custom', (e) => this._updateObject(e));
        html.on('click', '#transform-help', (e) => this.openHelpDialog(e));
    }
}
