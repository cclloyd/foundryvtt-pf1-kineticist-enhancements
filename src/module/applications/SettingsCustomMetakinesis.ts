import {ns} from '../lib/config';
import {ApplicationCustomMetakinesis} from './ApplicationCustomMetakinesis';
import {getSetting, setSetting} from "#ke/module/lib/util";
import type {MetakinesisConfig} from "#ke/types/metakinesis";

export class SettingsCustomMetakinesis extends FormApplication {
    key = 'customMetakinesis';
    actor: Actor;
    parent: any;
    _onSettingUpdate: Function;

    constructor(options = {}, actor: Actor) {
        super(options);
        this.actor = actor;

        // Listen for changes to the custom metakinesis setting and re-render if it changes
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
            id: `settings-custom-metakinesis`,
            classes: [ns],
            template: `modules/${ns}/templates/custom-metakinesae.hbs`,
            popOut: true,
            resizable: true,
            width: 400,
            height: 400,
            title: 'Custom Metakinesis Talents',
        });
    }

    async close(options: Application.CloseOptions) {
        if (this._onSettingUpdate) { // @ts-ignore
            Hooks.off('updateSetting', this._onSettingUpdate);
        }
        return super.close(options);
    }

    async getSavedCustomItems() {
        return await getSetting(this.key) as Record<string, MetakinesisConfig>
    }

    getData() {
        const allCustom = game.settings!.get(ns, this.key) as Record<string, MetakinesisConfig>;

        return {
            customMetakinesis: Object.values(allCustom),
        };
    }

    async _updateObject(event: Event, formData: any) {
        event.preventDefault();
        await this.close({});
    }

    openCustom() {
        let app = new ApplicationCustomMetakinesis({ parent: this });
        app.render(true);
    }

    async deleteCustom(event: JQuery.ClickEvent, formId: string) {
        event.preventDefault();
        const allCustom = await this.getSavedCustomItems();
        const existing = allCustom[formId];
        new Dialog({
            title: `Confirm Delete ${existing.name}`,
            content: `<p>Are you sure you want to delete ${existing.name}</p>`,
            buttons: {
                yes: {
                    icon: '<i class="fas fa-check"></i>',
                    label: 'Yes',
                    callback: async () => {
                        const allCustom = await this.getSavedCustomItems();
                        delete allCustom[formId];
                        await setSetting(this.key, allCustom);
                        this.render(false);
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

    async editCustom(event: JQuery.ClickEvent, formId: string) {
        event.preventDefault();
        const allCustom = await this.getSavedCustomItems();
        const app = new ApplicationCustomMetakinesis({ parent: this, defaultData: allCustom[formId] ?? {} });
        app.render(true);
    }

    async activateListeners(html: JQuery) {
        super.activateListeners(html);
        html.on('click', '#add-custom-metakinesis', () => this.openCustom());

        const allCustom = await this.getSavedCustomItems();
        for (let key of Object.keys(allCustom)) {
            html.on('click', `#custom-${allCustom[key].id}-delete`, (e: JQuery.ClickEvent) => this.deleteCustom(e, allCustom[key].id));
            html.on('click', `#custom-${allCustom[key].id}-edit`, (e: JQuery.ClickEvent) => this.editCustom(e, allCustom[key].id));
        }
    }
}
