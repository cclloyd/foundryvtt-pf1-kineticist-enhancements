import { keLogger } from '../lib/logger';
import { registerSettings } from '#ke/module/lib/settings';
import { preloadTemplates } from '#ke/module/lib/preloadTemplates';

export const initModule = () => {
    keLogger.log('Initializing pf1-kineticist-enhancements');

    // Register custom module settings
    registerSettings();

    // Preload Handlebars templates
    preloadTemplates().then();
};
