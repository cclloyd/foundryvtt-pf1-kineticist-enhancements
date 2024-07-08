import { ns } from '../lib/config';

export class ApplicationCustomTransformHelp extends Application {
    constructor(options = {}) {
        super(options);
    }

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: `custom-infusion-help`,
            classes: [ns],
            template: `modules/${ns}/templates/partials/custom-infusion-help.hbs`,
            popOut: true,
            resizable: true,
            width: 800,
            height: 170,
            title: 'Transform Function Help',
        });
    }

    async close(options) {
        return super.close(options);
    }

    async _updateObject(event) {
        event.preventDefault();
        await this.close();
    }

    activateListeners(html) {}
}
