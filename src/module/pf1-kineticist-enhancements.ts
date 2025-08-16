import { initModule } from './hooks/init';
import { getSceneControlButtons } from '#ke/module/hooks/getSceneControlButtons';

// Initialize module
Hooks.once('init', initModule);

// @ts-ignore
Hooks.on('getSceneControlButtons', getSceneControlButtons);
