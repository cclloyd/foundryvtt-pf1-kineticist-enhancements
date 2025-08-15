const updateMacro = async () => {
    let actor = game.actors.getName('Nalayuki');
    let item = actor.items.getName('Moonveil Test');
    let buff = actor.items.getName('Sharpened Edge');
    const active = buff.system.active;
    const critRange = active ? 15 : 18;
    for (const action of item.actions.contents) {
        action.update({'ability.critRange': critRange});
    }
}
updateMacro();
