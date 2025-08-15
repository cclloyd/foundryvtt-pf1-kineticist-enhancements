//bite action id IiGE0Zs6EhvZFhSv

const actor = game.actors.getName('Dusk');
const biteActual = actor.items.get('zUWA7fMbxvVXLty0');
const clawActual = actor.items.get('IvQc9NX7p1owE3TH');
console.log('actor', actor);
console.log('rollData', rollData)
console.log('biteActual', biteActual)
console.log('clawActual', clawActual)


const biteResult = await biteActual.use({skipDialog: true, chatMessage: false})
const clawResult = await clawActual.use({skipDialog: true, chatMessage: false})
console.log('biteResult', biteResult)
console.log('clawResult', clawResult)


const templateContent = await fetch(biteResult.chatTemplate).then(response => response.text());
//console.log('templateContent', templateContent)
const template = Handlebars.compile(templateContent, biteResult.templateSettings);
const renderedTemplate = template(biteResult.chatData);
console.log('renderedTemplate', renderedTemplate)
// Define the chat message data
const messageData = {
    user: game.user._id,
    content: renderedTemplate,
    speaker: {
        alias: "Template Speaker",
        scene: canvas.scene._id,
        actor: actor,
    }
};

// Create a new chat message
const chatMessage = await ChatMessage.create(messageData);
chatMessage.render(false);







const biteHtml = $(biteResult.content).find('.chat-attack')
const clawHtml = $(clawResult.content).find('.chat-attack')
console.log('biteHtml', biteHtml)
console.log('clawHtml', clawHtml)






const biteStr = biteHtml.html();
let clawStr = '';
for (let elem of clawHtml) {
    console.log('elem', elem)
    clawStr += elem.outerHTML;
};

const results_html = `
<div class="pf1 chat-card item-card" data-actor-id="abiMQXHnoW3JSqrN" data-item-id="zUWA7fMbxvVXLty0" data-action-id="IiGE0Zs6EhvZFhSv"><header class="card-header type-color type-attack flexrow">

  <h3 class="item-name chat-portrait-text-size-name-generic"><img src="icons/creatures/abilities/mouth-teeth-fire-orange.webp" data-tooltip="Bite (L) Actual (Attack)" width="36" height="36" class="chat-portrait-image-size-name-generic">Bite (L) Actual (Attack)</h3>
</header>

<div class="card-content" style="display: none;">
  <section class="item-description">

  </section>
</div>

  <div class="card-range gm-sensitive" data-range="15">
    Range: Melee
  </div>


  ${biteStr}
  ${clawStr}
</div>
`

ChatMessage.create({
    user: game.user._id,
    speaker: ChatMessage.getSpeaker({token: actor}),
    content: results_html
});
