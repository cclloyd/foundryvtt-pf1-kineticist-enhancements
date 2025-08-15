const actor = game.actors.getName('DuskExported'); //bite action id IiGE0Zs6EhvZFhSv
const biteActual = actor.items.getName('Bite Actual');
const clawActual = actor.items.getName('Claw Actual');
const tailActual = actor.items.getName('Tail Actual');
const wingActual = actor.items.getName('Wing Actual');


const biteResult = await biteActual.use({skipDialog: true, chatMessage: false})
const clawResult = await clawActual.use({skipDialog: true, chatMessage: false})
const tailResult = await tailActual.use({skipDialog: true, chatMessage: false})
const wingResult = await wingActual.use({skipDialog: true, chatMessage: false})

const attacks = [
    ...biteResult.templateData.attacks,
    ...clawResult.templateData.attacks,
    ...wingResult.templateData.attacks,
    ...tailResult.templateData.attacks,
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
