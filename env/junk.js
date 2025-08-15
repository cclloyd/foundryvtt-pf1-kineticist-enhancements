

new Dialog({
    title:'Get Item By ID',
    content:`
    <form>
      <div class="form-group">
        <label>ID</label>
        <input type='text' name='inputField'></input>
      </div>
    </form>`,
    buttons:{
        yes: {
            icon: "<i class='fas fa-check'></i>",
            label: `Fetch item`
        }},
    default:'yes',
    close: html => {
        let result = html.find('input[name=\'inputField\']');
        let value = result.val() ;
        const actor = game.actors.filter((o) => o.data._id === 'Yx6PJexA5rMgDZ45')[0];
        const item = actor.items.filter((o) => o.data._id === value)[0];
        console.log('item', item);
    }
}).render(true);



    prepend: false,
    append: true,
    prependText: null,
    appendText: 'Blade',
    noBlastText: true,
