import { keLogger } from '../lib/logger';
import { registerSettings } from '../settings';
import { preloadTemplates } from '../lib/preloadTemplates';

export const initModule = () => {
    keLogger.log('Initializing pf1-kineticist-enhancements');

    // Register custom module settings
    registerSettings();

    // Preload Handlebars templates
    preloadTemplates().then();
};
