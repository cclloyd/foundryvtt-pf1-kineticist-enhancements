import { ns } from './config.js';

export async function preloadTemplates() {
    const templatePaths = [
        'partials/setup.hbs',
        'partials/tab-content.hbs',
        'partials/tab-blasts.hbs',
        'partials/tab-infusions.hbs',
        'partials/tab-utilities.hbs',
        'partials/tab-metakinesis.hbs',
        'partials/tab-name.hbs',
        'actor-select.hbs',
        'blast-attack.hbs',
        'blast-attack-card.hbs',
        'hud.hbs',
    ];
    return loadTemplates(templatePaths.map((t) => `modules/${ns}/templates/${t}`));
}
