/**
 * This is your JavaScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your module, or remove it.
 * Author: [your name]
 * Content License: [copyright and-or license] If using an existing system
 *                    you may want to put a (link to a) license or copyright
 *                    notice here (e.g. the OGL).
 * Software License: [your license] Put your desired license here, which
 *                     determines how others may use and modify your module.
 */

// Import JavaScript modules
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

/*
Hooks.on('getSceneControlButtons', (buttons) => {
    let tokenButton = buttons.find((button) => button.name === 'token');
    if (tokenButton) {
        let tool = {
            name: 'ke-attack',
            title: 'Kinetic Blast Attack',
            layer: 'TokenLayer',
            icon: 'fas fa-axe',
            visible: true,
        };
        tokenButton.tools.push(tool);
    }
});

 */

//Hooks.on('canvasReady', () => {
//    canvas.stage.on('mousemove', (event) => this.mousemoveListener(event));
//    this.ruler = canvas.controls._rulers[game.user._id];
//});

Hooks.on('controlToken', (token, selected) => {
    console.warn('Controlling token');
    if (selected) {
        // Set the correct actor to the buttons
        if (game.keTokenHUD.actor === null) {
            game.keTokenHUD.actor = game.actors.get(token.data.actorId);
        } else if (game.keTokenHUD.actor.data._id !== token.data.actorId) {
            game.keTokenHUD.actor = game.actors.get(token.data.actorId);
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

Hooks.on('renderTokenActionHUD', (app, html, data) => {
    ////CONFIG.debug.hooks = true;
    //console.warn('Rendering token action hud');
    //const elem = $('#token-action-hud');
    //const xPos = parseInt(elem.css('left'));
    //const yPos = parseInt(elem.css('top'));
    //console.log('renderTokenActionHUD data', data);
    ////let hud = {};
    ////if actor.getFlag();
    //const hud = new ApplicationActorHUD({
    //    left: xPos,
    //    top: yPos + 50,
    //});
    //game.keHUD = hud;
});

Hooks.on('renderActorSheetPFCharacter', async (app, html, data) => {
    //if (data.actor.getFlag(ns, 'firstSetupCompleted') !== true) {
    //console.debug('Doing first setup', data.actor);
    //new SetupApplication().render(true);
    //const items = data.actor.getEmbeddedDocument('Energy Kinetic Blast');
    //const items = data.actor.getEmbeddedDocument('pf1.Item', 'Energy Kinetic Blast');
    /*
const items = data.actor.getEmbeddedCollection('Item');
for (const [key, value] of Object.entries(items)) {
    if (value.data.name === 'Energy Kinetic Blast')
    console.log(key, value);
}*/
    //console.log('items', items);
    /*new Dialog({
    title: "Kineticist Enhancements Setup",
    content: content,
    //"<p>Enter the amount you want to heal</p><center><input type='number' id='amountInput'></center><br>",
    buttons: {
        submit: {
            label: "Heal",
            icon: '<i class="fas fa-medkit"></i>',
            callback: () => {

            },
        },
    },
}).render(true);*/
    //}
});

// When ready
Hooks.once('ready', async () => {
    // TODO: Current app hook
    //let app = new ApplicationActorSelection();
    //app.render(true);
    /*
  for (let actor of actors) {
    if (Object.keys(actor.data.data.classes).includes('kineticist')) {
      console.debug(actor.items.filter(o => {return o.type === 'attack'}));
      const items = actor.items.filter(o => {return o.type === 'attack'});
      console.debug('found kineticist');
      const pfclass = actor.data.data.classes.kineticist;

      const managed = []
      for (let item of items) {
        console.log('item', item);
      }

      let testitem = null;
      actor.items.forEach(item => {
        if (item.data.name === 'Lightning')
          testitem = item;
      })
      //console.log('testitem', testitem);
      //console.log(await testitem.getFlag(ns, 'managed'))
      //await testitem.setFlag(ns, 'managed', true);
      continue;

      // Check each item for consistency
      for (let item of items) {
        console.debug('item name', item);
        break;
      }
    }
  }


      return
      console.log(physical, energy, managed);
      const simpleBlasts = []
      for (let flag of energy.entry.data.data.flags.boolean) {
          if (Object.keys(config.blasts.simple).includes(flag[0]))
              simpleBlasts.push(flag[0])
      }
      console.log('simpleBlasts', simpleBlasts);
    actor.createEmbeddedDocuments("Item", [{
        name: `Test attack ${Date.now()}`,
        type: 'attack',
        data: {
            flags: {
                boolean: ['isKineticistEnhanced', 'isBlast', 'isEnergy'],
                dictionary: [
                    ['blastType', 'simple'],
                    ['element1', 'air'],
                    ['element2', 'none'],
                    ['element3', 'none'],
                ]
            },
        },
    }]).then(item => {
        console.log('new item', item);
    });
  }
   */
});
