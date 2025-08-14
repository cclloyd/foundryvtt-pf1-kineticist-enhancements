import { getCoreMajorVersion } from '../lib/util';
import { ApplicationBlastAttack } from '../applications/ApplicationBlastAttack';
import { ApplicationActorConfig } from '../applications/ApplicationActorConfig';

const getSceneControlButtonGroup = (controls) => {
    const toolKey = getCoreMajorVersion() < 13 ? 'token' : 'tokens';
    if (getCoreMajorVersion() < 13) return controls.find((c) => c.name === toolKey);
    return controls[toolKey];
};

const kineticistSelected = () => {
    const selected = canvas.tokens?.controlled?.[0];
    return selected?.actor?.classes?.kineticist?.level > 0;
};

// export const getSceneControlButtons2 = (controls) => {
//     // Verify the hook runs
//     console.debug('KE: getSceneControlButtons fired');
//
//     // v12 passes an array; v13 passes an object
//     const isArray = Array.isArray(controls);
//
//     // Get the Token controls group in both structures
//     const tokenGroup = isArray
//         ? (controls.find((c) => c.name === 'token') ??
//             controls.find((c) => c.name === 'tokens') ??
//           controls.find((c) => c.layer === 'tokens') : controls.tokens;
//
//     if (!tokenGroup) {
//         console.warn('KE: Token controls group not found');
//         return;
//     }
//
//     const tool = {
//         name: 'ke-example',
//         title: 'Example Action',
//         icon: 'fas fa-burst',
//         button: true,
//         visible: true,
//         onClick: () => {
//             console.log('KE: Example tool clicked');
//             ui.notifications?.info('Example tool clicked');
//         },
//     };
//
//     // Upsert the tool to avoid duplicates
//     if (Array.isArray(tokenGroup.tools)) {
//         const idx = tokenGroup.tools.findIndex((t) => t.name === tool.name);
//         if (idx >= 0) tokenGroup.tools[idx] = {...tokenGroup.tools[idx], ...tool};
//         else tokenGroup.tools.push(tool);
//     } else if (tokenGroup.tools && typeof tokenGroup.tools === 'object') {
//         tokenGroup.tools[tool.name] = tool;
//     }
// };

export const getSceneControlButtons = (controls) => {
    const toolKey = getCoreMajorVersion() < 13 ? 'token' : 'tokens';
    const buttonGroup = getSceneControlButtonGroup(controls);

    const buttonActorConfig = {
        name: 'ke-actor-config',
        title: 'Kineticist Enhanced Config',
        icon: 'fas fa-hand-sparkles',
        button: true,
        visible: kineticistSelected,
        onClick: () => {
            const selectedToken = canvas.tokens?.controlled?.[0];
            if (!selectedToken) {
                ui.notifications?.warn('Select a single kineticist token first.');
                return;
            }

            const actor = selectedToken.actor;
            if (actor?.classes?.kineticist?.level > 0) {
                const app = new ApplicationActorConfig({}, actor);
                app.render(true);
            } else {
                ui.notifications?.warn('Selected actor has no kineticist levels.');
            }
        },
    };
    const buttonBlastAttack = {
        name: 'ke-blast-attack',
        title: 'Kinetic Blast Attack',
        icon: 'fas fa-burst',
        button: true,
        visible: kineticistSelected,
        onClick: () => {
            const selectedToken = canvas.tokens?.controlled?.[0];
            if (!selectedToken) {
                ui.notifications.warn('Select a single kineticist token first.');
                return;
            }

            const actor = selectedToken.actor;
            if (actor?.classes?.kineticist?.level > 0) {
                let app = new ApplicationBlastAttack({
                    actor: actor,
                });
                app.render(true);
            } else {
                ui.notifications.warn('Selected actor has no kineticist levels.');
            }
        },
    };

    if (getCoreMajorVersion() < 13) {
        buttonGroup.tools.push(buttonActorConfig, buttonBlastAttack);
    } else {
        Object.assign(controls[toolKey].tools, {
            'ke-actor-config': buttonActorConfig,
            'ke-blast-attack': buttonBlastAttack,
        });
    }
};
