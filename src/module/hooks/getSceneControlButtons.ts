import { getCoreMajorVersion } from '#ke/module/lib/util';
import {ApplicationActorConfig} from "#ke/module/applications/ApplicationActorConfig";

const getSceneControlButtonGroup = (controls: Record<string, any> | any[] ) => {
    const toolKey = getCoreMajorVersion() < 13 ? 'token' : 'tokens';
    if (getCoreMajorVersion() < 13) return controls.find((c: any) => c.name === toolKey);
    return controls[toolKey];
};

const kineticistSelected = () => {
    const selected = canvas!.tokens?.controlled?.[0];
    return selected?.actor?.classes?.kineticist?.level > 0;
};

export const getSceneControlButtons = (controls: any) => {
    const toolKey = getCoreMajorVersion() < 13 ? 'token' : 'tokens';
    const buttonGroup = getSceneControlButtonGroup(controls);

    const buttonActorConfig = {
        name: 'ke-actor-config',
        title: 'Kineticist Enhanced Config',
        icon: 'fas fa-hand-sparkles',
        button: true,
        visible: kineticistSelected,
        onClick: () => {
            const selectedToken = canvas!.tokens?.controlled?.[0];
            if (!selectedToken) {
                ui.notifications?.warn('Select a single kineticist token first.');
                return;
            }

            const actor = selectedToken.actor;
            if (actor?.classes?.kineticist?.level > 0) {
                const app = new ApplicationActorConfig({actor});
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
            const selectedToken = canvas!.tokens?.controlled?.[0];
            if (!selectedToken) {
                ui.notifications?.warn('Select a single kineticist token first.');
                return;
            }

            const actor = selectedToken.actor;
            if (actor?.classes?.kineticist?.level > 0) {
                let app = new ApplicationBlastAttack({
                    actor: actor,
                });
                app.render(true);
            } else {
                ui.notifications?.warn('Selected actor has no kineticist levels.');
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
