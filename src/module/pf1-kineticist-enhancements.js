import { registerSettings } from './settings.js';
import { preloadTemplates } from './lib/preloadTemplates.js';
import { ApplicationActorHUD } from './models/ApplicationActorHUD';

// Initialize module
Hooks.once('init', async () => {
    //CONFIG.debug.hooks = true;
    console.log('pf1-kineticist-enhancements | Initializing pf1-kineticist-enhancements');

    // Assign custom classes and constants here

    // Register custom module settings
    registerSettings();

    // Preload Handlebars templates
    await preloadTemplates();

    // Register custom sheets (if any)
});

// Setup module
Hooks.once('setup', async () => {
    // Do anything after initialization but before ready
});

Hooks.on('controlToken', (token, selected) => {
    if (selected && token.actor.classes.kineticist?.level > 0) {
        // Set the correct actor to the buttons
        if (game.keTokenHUD.actor === null) {
            game.keTokenHUD.actor = token.actor;
        } else if (game.keTokenHUD.actor.id !== token.document.actorId) {
            game.keTokenHUD.actor = game.actors.get(token.document.actorId);
        }
        // Set position of the HUD relative to Token Action HUD
        const elem = $('#token-action-hud');
        game.keTokenHUD.setPosition({ top: parseInt(elem.css('top')) + 40, left: parseInt(elem.css('left')) });

        // Render the application
        game.keTokenHUD.render(true);
    } else {
        game.keTokenHUD.close().then();
    }
});

Hooks.on('canvasReady', async () => {
    if (!game.keTokenHUD) {
        game.keTokenHUD = new ApplicationActorHUD({}, game.user);
    }
    //CONFIG.debug.hooks = true;
});

//Hooks.on('renderTokenActionHUD', (app, html, data) => {});

//Hooks.on('renderActorSheetPFCharacter', async (app, html, data) => {});

// When ready
//Hooks.once('ready', async () => {});
