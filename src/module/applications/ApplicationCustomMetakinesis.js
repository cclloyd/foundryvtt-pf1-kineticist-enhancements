import { ns } from '../lib/config';
import { serializeForm } from '../lib/common';
import { ApplicationCustomTransformHelp } from './ApplicationCustomTransformHelp';

export class ApplicationCustomMetakinesis extends Application {
    constructor(config) {
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

        const formData = serializeForm('custom-metakinesis');

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
