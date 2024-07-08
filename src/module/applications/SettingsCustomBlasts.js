import { ns } from '../lib/config';
import { ApplicationCustomUtility } from './ApplicationCustomUtility';
import { ApplicationCustomBlast } from './ApplicationCustomBlast';

export class SettingsCustomBlasts extends FormApplication {
    constructor(options = {}, actor = null) {
        super(options);
        this.actor = actor;
        this.key = 'customBlasts';
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: `settings-custom-blasts`,
            classes: [ns],
            template: `modules/${ns}/templates/custom-blasts.hbs`,
            popOut: true,
            resizable: true,
            width: 600,
            height: 400,
            title: 'Custom Blasts',
        });
    }

    async close(options) {
        return super.close(options);
    }

    getData() {
        const allBlasts = game.settings.get(ns, this.key) ?? {};
        const simpleBlasts = Object.values(allBlasts).filter((b) => b.class === 'simple');
        const compositeBlasts = Object.values(allBlasts).filter((b) => b.class === 'composite');
        return {
            customSimpleBlasts: Object.values(simpleBlasts),
            customCompositeBlasts: Object.values(compositeBlasts),
        };
    }

    async _updateObject(event, formData) {
        event.preventDefault();
        await this.close();
    }

    openCustom(blastType) {
        let app = new ApplicationCustomBlast({ parent: this, blastType: blastType });
        app.render(true);
    }

    async deleteCustom(event, formId) {
        event.preventDefault();
        const custom = await game.settings.get(ns, this.key);
        const existing = custom[formId];
        new Dialog({
            title: `Confirm Delete ${existing.name}`,
            content: `<p>Are you sure you want to delete ${existing.name}</p>`,
            buttons: {
                yes: {
                    icon: '<i class="fas fa-check"></i>',
                    label: 'Yes',
                    callback: async () => {
                        const objects = await game.settings.get(ns, this.key);
                        delete custom[formId];
                        await game.settings.set(ns, this.key, objects);
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

    async editCustom(event, formId) {
        event.preventDefault();
        const custom = (await game.settings.get(ns, this.key)) ?? {};
        const app = new ApplicationCustomBlast({ parent: this, defaultData: custom[formId] ?? {} });
        app.render(true);
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.on('click', '#add-custom-simple', () => this.openCustom('simple'));
        html.on('click', '#add-custom-composite', () => this.openCustom('composite'));

        const allCustom = game.settings.get(ns, this.key) ?? {};
        for (let key of Object.keys(allCustom)) {
            html.on('click', `#custom-${allCustom[key].id}-delete`, (e) => this.deleteCustom(e, allCustom[key].id));
            html.on('click', `#custom-${allCustom[key].id}-edit`, (e) => this.editCustom(e, allCustom[key].id));
        }
    }
}
