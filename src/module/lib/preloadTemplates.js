import { ns } from './config.js';

export async function preloadTemplates() {
    const templatePaths = [
        'setup.hbs',
        'partials/tab-content.hbs',
        'partials/tab-blasts.hbs',
        'partials/tab-infusions.hbs',
        'partials/tab-utilities.hbs',
        'partials/tab-metakinesis.hbs',
        'actor-config.hbs',
        'blast-attack.hbs',
        'hud.hbs',
    ];
    return loadTemplates(templatePaths.map((t) => `modules/${ns}/templates/${t}`));
}
