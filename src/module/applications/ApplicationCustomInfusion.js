import { ns } from '../lib/config';
import { ApplicationCustomTransformHelp } from './ApplicationCustomTransformHelp';
import { capitalizeFirstLetter, serializeForm } from '../lib/common';

export class ApplicationCustomInfusion extends Application {
    constructor(config) {
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
        this.parent = config.parent;
        this.defaultData = config.defaultData ?? {};
        this.infusionType = config.infusionType ?? 'form';
        switch (this.infusionType) {
            case 'form':
                this.key = 'customFormInfusions';
                break;
            case 'substance':
                this.key = 'customSubstanceInfusions';
                break;
            default:
                break;
        }
    }

    async close(options) {
        return super.close(options);
    }

    getData() {
        console.log('defaultData', this.defaultData);
        return foundry.utils.mergeObject(super.getData(), {
            actor: this.actor,
            infusion: this.defaultData,
            infusionType: this.infusionType,
            infusionTypeName: this.infusionType.charAt(0).toUpperCase() + this.infusionType.slice(1),
        });
    }

    async _updateObject(event) {
        event.preventDefault();

        const formData = serializeForm('custom-infusion');

        // Normalize and validate the new ID
        let newId = (formData.id ?? '').trim();
        if (!newId || newId.length < 3) newId = 'default';

        // Load existing infusions
        const existing = foundry.utils.duplicate(game.settings.get(ns, this.key) ?? {});

        // If we are editing an existing infusion and the ID changed, remove the old entry
        const oldId = this?.defaultData?.id;
        if (oldId && oldId !== newId && existing[oldId]) {
            delete existing[oldId];
        }

        // Save under the new ID
        formData.id = newId;
        existing[newId] = formData;
        await game.settings.set(ns, this.key, existing);
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
        //super.activateListeners(html);
        html.on('click', '#save-custom-form-infusion', (e) => this._updateObject(e));
        html.on('click', '#transform-help', (e) => this.openHelpDialog(e));
    }
}
