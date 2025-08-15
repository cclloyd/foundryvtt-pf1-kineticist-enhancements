const templateContent = `
<div style="display: flex; gap: 1rem;">
    <div><input type='checkbox' name='bite' id="bite" checked/><label for="bite">Bite</label></td></tr></div>
    <div><input type='checkbox' name='claw' id="claw" checked/><label for="claw">Claw</label></td></tr></div>
    <div><input type='checkbox' name='wing' id="wing" checked/><label for="wing">Wing</label></td></tr></div>
    <div><input type='checkbox' name='tail' id="tail" checked/><label for="tail">Tail</label></td></tr></div>
</div>
<hr/>
<div>
    <div><input type='checkbox' name='mythicpa' id="mythicpa" checked/><label for="mythicpa">Mythic Power Attack</label></td></tr></div>
</div>
<hr/>
`
// TODO: Add misc attack bonus/damage bonus and pass to item usage
// TODO: Add checkbox for haste attack (bite)

const rollAttack = async (html) => {

    // Get form values
    const bite = html.find('input[name="bite"]').prop('checked');
    const claw = html.find('input[name="claw"]').prop('checked');
    const wing = html.find('input[name="wing"]').prop('checked');
    const tail = html.find('input[name="tail"]').prop('checked');
    const mythicpa = html.find('input[name="mythicpa"]').prop('checked');

    const actor = game.actors.getName('DuskExported');
    const biteActual = actor.items.getName('Bite Actual');
    const clawActual = actor.items.getName('Claw Actual');
    const tailActual = actor.items.getName('Tail Actual');
    const wingActual = actor.items.getName('Wing Actual');

    // TODO: modify damage here if mythicpa is on

    const biteResult = await biteActual.use({skipDialog: true, chatMessage: false})
    const clawResult = await clawActual.use({skipDialog: true, chatMessage: false})
    const tailResult = await tailActual.use({skipDialog: true, chatMessage: false})
    const wingResult = await wingActual.use({skipDialog: true, chatMessage: false})

    const attacks = [
        ...bite ? biteResult.templateData.attacks : [],
        ...claw ? clawResult.templateData.attacks : [],
        ...wing ? wingResult.templateData.attacks : [],
        ...tail ? tailResult.templateData.attacks : [],
    ];

    biteResult.templateData.attacks = attacks;

    const renderedTemplate = await renderTemplate(biteResult.chatTemplate, biteResult.templateData)
    const chatMessage = await ChatMessage.create({
        user: game.user._id,
        content: renderedTemplate,
        speaker: {
            alias: actor.name,
            scene: canvas.scene._id,
            actor: actor,
        }
    });
    chatMessage.render(false);

}


const myDialog = new Dialog({
    title:'Choose Attacks',
    content: templateContent,
    buttons: {
        attack: {
            label: "Roll Attack",
            icon: `<i class="fas fa-check"></i>`
        },
    },
    close: rollAttack,
}, {width: 600,}).render(true);
