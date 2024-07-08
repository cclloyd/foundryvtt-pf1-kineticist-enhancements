import { ns } from '../lib/config';
import { ApplicationCustomInfusion } from './ApplicationCustomInfusion';

export class SettingsCustomInfusions extends FormApplication {
    constructor(options = {}, actor = null) {
        super(options);
        this.actor = actor;
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: `settings-custom-infusions`,
            classes: [ns],
            template: `modules/${ns}/templates/custom-infusions.hbs`,
            popOut: true,
            resizable: true,
            width: 800,
            height: 400,
            title: 'Custom Infusions',
        });
    }

    async close(options) {
        return super.close(options);
    }

    getData() {
        const allCustomFormInfusions = game.settings.get(ns, 'customFormInfusions') ?? {};
        const allCustomSubstanceInfusions = game.settings.get(ns, 'customSubstanceInfusions') ?? {};

        return {
            customFormInfusions: Object.values(allCustomFormInfusions),
            customSubstanceInfusions: Object.values(allCustomSubstanceInfusions),
        };
    }

    async _updateObject(event, formData) {
        event.preventDefault();
        await this.close();
    }

    openCustomInfusion(infusionType) {
        let app = new ApplicationCustomInfusion({ infusionType: infusionType, parent: this });
        app.render(true);
    }

    async deleteCustomInfusion(event, infusionType, formId) {
        event.preventDefault();
        let infusionKey;
        switch (infusionType) {
            case 'form':
                infusionKey = 'customFormInfusions';
                break;
            case 'substance':
                infusionKey = 'customSubstanceInfusions';
                break;
            default:
                break;
        }
        const customInfusions = await game.settings.get(ns, infusionKey);
        const infusion = customInfusions[formId];
        new Dialog({
            title: `Confirm Delete ${infusion.name}`,
            content: `<p>Are you sure you want to delete ${infusion.name}</p>`,
            buttons: {
                yes: {
                    icon: '<i class="fas fa-check"></i>',
                    label: 'Yes',
                    callback: async () => {
                        const infusions = await game.settings.get(ns, infusionKey);
                        delete customInfusions[formId];
                        await game.settings.set(ns, infusionKey, infusions);
                        await this.render(false);
                    },
                },
                no: {
                    icon: '<i class="fas fa-times"></i>',
                    label: 'No',
                },
            },
            default: 'no',
        }).render(true);
    }

    async editCustomInfusion(event, infusionType, formId) {
        event.preventDefault();
        const customInfusions =
            (await game.settings.get(
                ns,
                infusionType === 'form' ? 'customFormInfusions' : 'customSubstanceInfusions',
            )) ?? {};
        const app = new ApplicationCustomInfusion({ parent: this, defaultData: customInfusions[formId] ?? null });
        app.render(true);
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.on('click', '#add-custom-form-infusion', () => this.openCustomInfusion('form'));
        html.on('click', '#add-custom-substance-infusion', () => this.openCustomInfusion('substance'));

        const allCustomFormInfusions = game.settings.get(ns, 'customFormInfusions') ?? {};
        for (let key of Object.keys(allCustomFormInfusions)) {
            html.on('click', `#custom-form-${allCustomFormInfusions[key].id}-delete`, (e) =>
                this.deleteCustomInfusion(e, 'form', allCustomFormInfusions[key].id),
            );
            html.on('click', `#custom-form-${allCustomFormInfusions[key].id}-edit`, (e) =>
                this.editCustomInfusion(e, 'form', allCustomFormInfusions[key].id),
            );
        }

        const allCustomSubstanceInfusions = game.settings.get(ns, 'customSubstanceInfusions') ?? {};
        for (let key of Object.keys(allCustomSubstanceInfusions)) {
            html.on('click', `#custom-substance-${allCustomSubstanceInfusions[key].id}-delete`, (e) =>
                this.deleteCustomInfusion(e, 'substance', allCustomSubstanceInfusions[key].id),
            );
            html.on('click', `#custom-substance-${allCustomSubstanceInfusions[key].id}-edit`, (e) =>
                this.editCustomInfusion(e, 'substance', allCustomSubstanceInfusions[key].id),
            );
        }
    }
}
