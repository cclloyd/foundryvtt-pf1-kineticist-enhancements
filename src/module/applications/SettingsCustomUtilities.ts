import { ns } from '../lib/config';
import { ApplicationCustomUtility } from './ApplicationCustomUtility';

export class SettingsCustomUtilities extends FormApplication {
    actor: Actor;
    key = 'customUtilityTalents';
    _onSettingUpdate: Function;

    constructor(options = {}, actor: Actor) {
        super(options);
        this.actor = actor;

        // Listen for changes to the custom utilities setting and re-render if it changes
        this._onSettingUpdate = (setting) => {
            try {
                const namespace = setting?.namespace ?? setting?.module;
                const key = setting?.key;
                if (namespace === ns && key === this.key) {
                    this.render(false);
                }
            } catch (err) {
                this.render(false);
            }
        };
        Hooks.on('updateSetting', this._onSettingUpdate);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: `settings-custom-utility`,
            classes: [ns],
            template: `modules/${ns}/templates/custom-utilities.hbs`,
            popOut: true,
            resizable: true,
            width: 400,
            height: 400,
            title: 'Custom Utility Talents',
        });
    }

    async close(options: any) {
        if (this._onSettingUpdate) Hooks.off('updateSetting', this._onSettingUpdate);
        return super.close(options);
    }

    getData() {
        const allUtilityTalents = game.settings.get(ns, this.key) ?? {};

        return {
            customUtilityTalents: Object.values(allUtilityTalents),
        };
    }

    async _updateObject(event: Event, formData: any) {
        event.preventDefault();
        await this.close(null);
    }

    openCustom() {
        let app = new ApplicationCustomUtility({ parent: this });
        app.render(true);
    }

    async deleteCustom(event: Event, formId: string) {
        event.preventDefault();
        const custom = await game.settings!.get(ns, this.key);
        if (!custom)  {
            game.notifications!.error('No custom utilities found');
            return;
        }
        const existing = custom[formId];
        new Dialog({
            title: `Confirm Delete ${existing.name}`,
            content: `<p>Are you sure you want to delete ${existing.name}</p>`,
            buttons: {
                yes: {
                    icon: '<i class="fas fa-check"></i>',
                    label: 'Yes',
                    callback: async () => {
                        const objects = await game.settings!.get(ns, this.key);
                        delete custom[formId];
                        await game.settings!.set(ns, this.key, objects);
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

    async editCustom(event: Event, formId: string) {
        event.preventDefault();
        const custom = (await game.settings!.get(ns, this.key)) ?? {};
        const app = new ApplicationCustomUtility({ parent: this, defaultData: custom[formId] ?? {} });
        app.render(true);
    }

    activateListeners(html: any) {
        super.activateListeners(html);
        html.on('click', '#add-custom-utility', () => this.openCustom());

        const allCustom = game.settings!.get(ns, this.key) ?? {};
        for (let key of Object.keys(allCustom)) {
            html.on('click', `#custom-${allCustom[key].id}-delete`, (e) => this.deleteCustom(e, allCustom[key].id));
            html.on('click', `#custom-${allCustom[key].id}-edit`, (e) => this.editCustom(e, allCustom[key].id));
        }
    }
}
