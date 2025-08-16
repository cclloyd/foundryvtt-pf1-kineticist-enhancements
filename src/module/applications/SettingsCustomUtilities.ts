import {ns} from '../lib/config';
import {ApplicationCustomUtility} from './ApplicationCustomUtility';
import type {UtilityTalentConfig} from "#ke/types/utilityTalents";
import {getSetting} from "#ke/module/lib/util";

export class SettingsCustomUtilities extends FormApplication {
    actor: Actor;
    key = 'customUtilityTalents';
    _onSettingUpdate: Function;

    constructor(options = {}, actor: Actor) {
        super(options);
        this.actor = actor;

        // Listen for changes to the custom utilities setting and re-render if it changes
        this._onSettingUpdate = (setting: any) => {
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
        // @ts-ignore
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
        // @ts-ignore
        if (this._onSettingUpdate) Hooks.off('updateSetting', this._onSettingUpdate);
        return super.close(options);
    }

    async getSavedCustomItems() {
        return await getSetting(this.key) as Record<string, UtilityTalentConfig>
    }

    getData() {
        const allUtilityTalents = getSetting(this.key) as Record<string, UtilityTalentConfig>;

        return {
            customUtilityTalents: Object.values(allUtilityTalents),
        };
    }

    async _updateObject(event: Event, formData: any) {
        event.preventDefault();
        await this.close(null);
    }

    openCustom() {
        let app = new ApplicationCustomUtility({parent: this});
        app.render(true);
    }

    async deleteCustom(event: Event, formId: string) {
        event.preventDefault();
        const allCustom = await this.getSavedCustomItems();
        if (!allCustom) {
            // @ts-ignore
            game.notifications?.error('No custom utilities found');
            return;
        }
        const existing = allCustom[formId];
        new Dialog({
            title: `Confirm Delete ${existing.name}`,
            content: `<p>Are you sure you want to delete ${existing.name}</p>`,
            buttons: {
                yes: {
                    icon: '<i class="fas fa-check"></i>',
                    label: 'Yes',
                    callback: async () => {
                        const objects = await game.settings!.get(ns, this.key);
                        delete allCustom[formId];
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
        const allCustom = await this.getSavedCustomItems();
        const app = new ApplicationCustomUtility({parent: this, defaultData: allCustom[formId] ?? {}});
        app.render(true);
    }

    async activateListeners(html: any) {
        super.activateListeners(html);
        html.on('click', '#add-custom-utility', () => this.openCustom());

        const allCustom = await this.getSavedCustomItems();
        for (let key of Object.keys(allCustom)) {
            html.on('click', `#custom-${allCustom[key].id}-delete`, (e: Event) => this.deleteCustom(e, allCustom[key].id));
            html.on('click', `#custom-${allCustom[key].id}-edit`, (e: Event) => this.editCustom(e, allCustom[key].id));
        }
    }
}
