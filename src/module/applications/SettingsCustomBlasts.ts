import {ns} from '../lib/config';
import {ApplicationCustomBlast} from './ApplicationCustomBlast';
import {getSetting, setSetting} from "#ke/module/lib/util";
import type {BlastClass, BlastConfig, CompositeBlastConfig, SimpleBlastConfig} from "#ke/types/blasts";

export class SettingsCustomBlasts extends FormApplication {
    key = 'customBlasts';
    actor: Actor;
    parent: any;
    _onSettingUpdate: Function;

    constructor(options = {}, actor: Actor) {
        super(options);
        this.actor = actor;

        // Listen for changes to the custom blasts setting and re-render if it changes
        this._onSettingUpdate = (setting: any) => {
            try {
                // Foundry VTT v12 uses `namespace`; older versions may have `module`
                const namespace = setting?.namespace ?? setting?.module;
                const key = setting?.key;
                if (namespace === ns && key === this.key) {
                    // Re-render but don't force a full re-open; just refresh contents
                    this.render(false);
                }
            } catch (err) {
                // If anything goes wrong determining the setting, fail-soft by re-rendering
                this.render(false);
            }
        };
        // @ts-ignore
        Hooks.on('updateSetting', this._onSettingUpdate);
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

    async close(options: Application.CloseOptions) {
        // Clean up hook to avoid leaks or duplicate listeners
        if (this._onSettingUpdate) { // @ts-ignore
            Hooks.off('updateSetting', this._onSettingUpdate);
        }
        return super.close(options);
    }

    async getSavedCustomItems() {
        return await getSetting(this.key) as Record<string, BlastConfig>
    }

    getData() {
        const allBlasts = getSetting(this.key) as BlastConfig;
        const simpleBlasts = Object.values(allBlasts).filter((b) => b.class === 'simple') as SimpleBlastConfig[];
        const compositeBlasts = Object.values(allBlasts).filter((b) => b.class === 'composite') as CompositeBlastConfig[];
        return {
            customSimpleBlasts: Object.values(simpleBlasts),
            customCompositeBlasts: Object.values(compositeBlasts),
        };
    }

    async _updateObject(event: Event, formData: any) {
        event.preventDefault();
        await this.close({});
    }

    openCustom(blastType: BlastClass) {
        let app = new ApplicationCustomBlast({ parent: this, blastType: blastType });
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
                        const objects = await game.settings!.get(ns, this.key);
                        delete allCustom[formId];
                        await setSetting(this.key, objects);
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

    async editCustom(event: JQuery.ClickEvent, formId: string) {
        event.preventDefault();
        const allCustom = await this.getSavedCustomItems();
        const app = new ApplicationCustomBlast({ parent: this, defaultData: allCustom[formId] ?? {} });
        app.render(true);
    }

    async activateListeners(html: any) {
        super.activateListeners(html);
        html.on('click', '#add-custom-simple', () => this.openCustom('simple'));
        html.on('click', '#add-custom-composite', () => this.openCustom('composite'));

        const allCustom = await this.getSavedCustomItems();
        for (let key of Object.keys(allCustom)) {
            html.on('click', `#custom-${allCustom[key].id}-delete`, (e: JQuery.ClickEvent) => this.deleteCustom(e, allCustom[key].id));
            html.on('click', `#custom-${allCustom[key].id}-edit`, (e: JQuery.ClickEvent) => this.editCustom(e, allCustom[key].id));
        }
    }
}
