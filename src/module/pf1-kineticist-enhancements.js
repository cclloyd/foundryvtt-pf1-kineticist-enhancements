/**
 * This is your JavaScript entry file for Foundry VTT.
 * Register custom settings, sheets, and constants using the Foundry API.
 * Change this heading to be more descriptive to your module, or remove it.
 * Author: [your name]
 * Content License: [copyright and-or license] If using an existing system
 * 					you may want to put a (link to a) license or copyright
 * 					notice here (e.g. the OGL).
 * Software License: [your license] Put your desired license here, which
 * 					 determines how others may use and modify your module.
 */

// Import JavaScript modules
import { registerSettings } from './settings.js';
import { preloadTemplates } from './lib/preloadTemplates.js';
import { ns } from './lib/config.js';
import { debug, getAllPlayersActors, sleep } from './lib/common';
import { SetupApplication } from './models/SetupApplication';

// Initialize module
Hooks.once('init', async () => {
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
    // Do anything after initialization but before
    // ready
});

Hooks.on('renderActorSheetPFCharacter', async (app, html, data) => {
    if (data.actor.getFlag(ns, 'firstSetupCompleted') !== true) {
        console.debug('Doing first setup', data.actor);
        new SetupApplication().render(true);

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
    }
});

// When ready
Hooks.once('ready', async () => {
    await sleep(500);
    let actors = await getAllPlayersActors();

    debug();
    let app = new SetupApplication();
    app.render(true);
    console.warn('tabs', app._tabs);

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
