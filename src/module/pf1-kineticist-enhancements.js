import { getSceneControlButtons } from './hooks/getSceneControlButtons';
import { initModule } from './hooks/init';

// Initialize module
Hooks.once('init', initModule);

Hooks.on('getSceneControlButtons', getSceneControlButtons);
