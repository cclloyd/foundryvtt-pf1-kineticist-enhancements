import { ns } from './config.js';

export async function preloadTemplates() {
    const templatePaths = [
        'partials/tab-content.hbs',
        'partials/tab-blasts.hbs',
        'partials/tab-infusions.hbs',
        'partials/tab-utilities.hbs',
        'partials/tab-metakinesis.hbs',
        'partials/tab-feats.hbs',
        'custom-infusion.hbs',
        'custom-infusions.hbs',
        'custom-utility.hbs',
        'custom-transform-help.hbs',
        'custom-utilities.hbs',
        'actor-config.hbs',
        'blast-attack.hbs',
        'hud.hbs',
    ];
    return loadTemplates(templatePaths.map((t) => `modules/${ns}/templates/${t}`));
}
