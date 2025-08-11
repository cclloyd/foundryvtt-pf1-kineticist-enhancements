Hooks.once('init', async () => {
    // Demonstrate configurable logger with module namespace as prefix
    keLogger.setPrefix(`${ns} | `);
    keLogger.info('Initializing pf1-kineticist-enhancements');

    // Register custom module settings
    registerSettings();

    // Preload Handlebars templates
    await preloadTemplates();
});
