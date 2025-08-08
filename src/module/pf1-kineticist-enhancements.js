import { registerSettings } from './settings.js';
import { preloadTemplates } from './lib/preloadTemplates.js';
import { ApplicationActorConfig } from './applications/ApplicationActorConfig';
import { ApplicationBlastAttack } from './applications/ApplicationBlastAttack';
import { ns } from './lib/config.js';
import { keLogger } from './lib/logger';

// Initialize module
Hooks.once('init', async () => {
    // Demonstrate configurable logger with module namespace as prefix
    keLogger.setPrefix(`${ns} | `);
    keLogger.info('Initializing pf1-kineticist-enhancements');

    // Register custom module settings
    registerSettings();

    // Preload Handlebars templates
    await preloadTemplates();
});

Hooks.on('getSceneControlButtons', (controls) => {
    const tokenControl = controls.find((c) => c.name === 'token');
    if (!tokenControl) return;

    const kineticistSelected = () => {
        const selected = canvas.tokens?.controlled?.[0];
        return selected?.actor?.classes?.kineticist?.level > 0;
    };

    tokenControl.tools.push(
        {
            name: 'ke-actor-config',
            title: 'Kineticist Enhanced Config',
            icon: 'fas fa-hand-sparkles',
            toggle: true,
            active: false,
            visible: kineticistSelected,
            onClick: () => {
                const tool = tokenControl.tools.find((t) => t.name === 'ke-actor-config');
                tool.active = false;
                ui.controls?.render();

                const selectedToken = canvas.tokens?.controlled?.[0];
                if (!selectedToken) {
                    ui.notifications?.warn('Select a single kineticist token first.');
                    return;
                }

                const actor = selectedToken.actor;
                if (actor?.classes?.kineticist?.level > 0) {
                    const app = new ApplicationActorConfig({}, actor);
                    app.render(true);
                } else {
                    ui.notifications?.warn('Selected actor has no kineticist levels.');
                }
            },
        },
        {
            name: 'ke-blast-attack',
            title: 'Kinetic Blast Attack',
            icon: 'fas fa-burst',
            toggle: true,
            active: false,
            visible: kineticistSelected,
            onClick: () => {
                const tool = tokenControl.tools.find((t) => t.name === 'ke-blast-attack');
                tool.active = false;
                ui.controls?.render();

                const selectedToken = canvas.tokens?.controlled?.[0];
                if (!selectedToken) {
                    ui.notifications.warn('Select a single kineticist token first.');
                    return;
                }

                const actor = selectedToken.actor;
                if (actor?.classes?.kineticist?.level > 0) {
                    let app = new ApplicationBlastAttack({
                        actor: actor,
                    });
                    app.render(true);
                } else {
                    ui.notifications.warn('Selected actor has no kineticist levels.');
                }
            },
        },
    );
});
