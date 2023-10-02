import { registerSettings } from './settings.js';
import { preloadTemplates } from './lib/preloadTemplates.js';
import { ApplicationActorHUD } from './models/ApplicationActorHUD';

// Initialize module
Hooks.once('init', async () => {
    //CONFIG.debug.hooks = true;
    console.log('pf1ke | Initializing pf1-kineticist-enhancements');

    // Register custom module settings
    registerSettings();

    // Preload Handlebars templates
    await preloadTemplates();
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
        const tah = game.tokenActionHud;
        let topPos = tah.hudPosition?.topPos ?? window.innerHeight - 80;
        let leftPos = tah.hudPosition?.leftPos ?? 220;
        console.log('old pos', topPos, leftPos);

        if (topPos >= window.innerHeight * 0.7) {
            console.log('putting menu above');
            topPos -= 40;
        } else {
            topPos += 40;
        }
        game.keTokenHUD.setPosition({ top: topPos, left: leftPos });
        console.log('new pos', topPos, leftPos);

        // Render the application
        game.keTokenHUD.render(true);
    } else {
        game.keTokenHUD.close().then();
    }

    const sc = new SceneControls();
    sc.controls[0].icon = 'fas fa-ruler-combined';
    sc.render();
    console.log('sc', sc);
    console.log('game', game);
    console.log('flags', token.actor.flags);
});

Hooks.on('getSceneControlButtons', (controls) => {
    console.log('controls', controls);
});

Hooks.on('canvasReady', async () => {
    if (!game.keTokenHUD) {
        game.keTokenHUD = new ApplicationActorHUD({}, game.user);
    }
});
