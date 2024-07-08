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
        // Set default ID if none provided
        if (!formData.id || formData.id.length < 3) formData.id = 'default';
        const existing = game.settings.get(ns, this.key) ?? {};
        existing[formData.id] = formData;
        game.settings.set(ns, this.key, existing);
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
