// Macro to update the image paths of all player character actors.
async function updateActorImagePaths() {
    const oldPath = "worlds/heavy-rain/icons/monster/ByType/Gacha/";
    const newPath = "assets/heavy-rain/icons/monster/ByType/Gacha/";

    // Filter for player characters only.
    const playerActors = game.actors.contents.filter(actor => actor !== null);

    // Loop through each player character.
    for (let actor of playerActors) {
        // Check and update token image.
        if (actor.prototypeToken.texture.src.startsWith(oldPath)) {
            console.log('Updating token', actor.name)
            await actor.update({'token.img': actor.prototypeToken.texture.src.replace(oldPath, newPath)});
        }

        // Check and update actor image.
        if (actor.img.startsWith(oldPath)) {
            console.log('Updating actor', actor.name)
            await actor.update({'img': actor.data.img.replace(oldPath, newPath)});
        }
    }

    console.log("Actor image paths updated.");
}

// Execute the function.
updateActorImagePaths();
