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
        //super.activateListeners(html);
        html.on('click', '#save-custom-form-infusion', (e) => this._updateObject(e));
        html.on('click', '#transform-help', (e) => this.openHelpDialog(e));
    }
}
