import { preloadTemplates } from "./lib/preloadTemplates.js";
import { keLogger } from "./lib/logger.js";
import { ns } from "./lib/config.js";
import { registerSettings } from "./lib/settings.js";
import "../types/pf1-kineticist-enhancements.d.ts";

Hooks.once('init', async () => {
    // Demonstrate configurable logger with module namespace as prefix
    keLogger.setPrefix(`${ns} | `);
    keLogger.log('Initializing pf1-kineticist-enhancements');

    // Register custom module settings
    registerSettings();

    // Preload Handlebars templates
    await preloadTemplates();
});
