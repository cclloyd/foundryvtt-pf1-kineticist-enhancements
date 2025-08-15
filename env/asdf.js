const runMacro = async () => {
    const token = canvas.tokens.controlled[0];
    if (!token) {
        console.log('Select a token first.');
        ui.notifications.warn('Select a token first.');
        return;
    }

// Fetch the existing first aura object or abort
    const auras = token.document.getFlag('grid-aware-auras', 'auras') || [];
    if (!auras.length) {
        console.log('No existing aura found on this token.');
        ui.notifications.warn('No existing aura found on this token.');
        return;
    }

// Clone the first aura object so we can edit it safely
    const auraTemplate = foundry.utils.duplicate(auras[0]);

    new Dialog({
        title: 'Set Combat Reach Aura',
        content: `
    <form>
      <label><input type="checkbox" name="enabled" checked/>Enabled (uncheck to hide aura)</label>

      <div class="form-group" style="padding-bottom: 1rem;">
        <label><input type="checkbox" name="reach" checked/>Reach</label>
        <label><input type="checkbox" name="combatPatrol" checked/> Combat Patrol</label>
        <label><input type="checkbox" name="combatPatrolMythic" checked/> (Mythic)</label>
      </div>
      </div>
    </form>
  `,
        buttons: {
            ok: {
                label: 'Apply',
                callback: html => {
                    const form = html[0].querySelector('form');
                    const formData = new FormData(form);
                    console.log('formData', formData);

                    const size = token.actor.system.traits.size.value;
                    const enabled = formData.get('enabled') === 'on';
                    const patrol = formData.get('combatPatrol') === 'on';
                    const patrolMythic = formData.get('combatPatrolMythic') === 'on';
                    const reach = formData.get('reach') === 'on';

                    let naturalReach = 5;
                    switch (size) {
                        case 5: naturalReach = 10; break;
                        case 6: naturalReach = 15; break;
                        case 7: naturalReach = 20; break;
                        case 8: naturalReach = 30; break;
                    }
                    // Apply Natural Reach
                    let calculatedReach = naturalReach;
                    console.log('applying natural reach', calculatedReach);

                    // Apply Reach
                    if (reach) {
                        calculatedReach *= 2;
                        console.log('applying reach', calculatedReach);
                    }

                    // Apply Combat Patrol
                    if (patrol) {
                        let bab = token.actor.system.attributes.bab.total;
                        let patrolBonus = 5 * Math.floor(bab/5);
                        calculatedReach += patrolBonus;
                        console.log('applying patrol', calculatedReach, patrolBonus, bab);
                    }

                    // Apply Mythic Combat Patrol
                    if (patrolMythic) {
                        calculatedReach += 5;
                        console.log('applying patrol mythic', calculatedReach);
                    }

                    // Example: apply values (customize later)
                    const finalRadius = Math.floor(calculatedReach / 5);
                    console.log('final radius', finalRadius);
                    auraTemplate.radius = finalRadius;

                    const newAuras = [...auras];
                    newAuras[0] = auraTemplate;

                    auraTemplate.enabled = enabled;
                    console.log('setting new aura', newAuras)
                    token.document.setFlag('grid-aware-auras', 'auras', newAuras);
                }
            },
            cancel: {
                label: 'Cancel'
            }
        },
        default: 'ok'
    }).render(true);
}
runMacro();
