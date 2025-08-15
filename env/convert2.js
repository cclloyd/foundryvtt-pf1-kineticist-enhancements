// Define the old and new base paths
const oldBasePath = 'worlds/heavy-rain/scenes';
const newBasePath = 'assets/heavy-rain/scenes';

// Function to update the scene paths
async function updateScenePaths() {
    // Get all scenes
    const scenes = game.scenes.contents;

    // Filter scenes that need their path updated
    const scenesToUpdate = scenes.filter(scene => scene.background.src.startsWith(oldBasePath));

    // Prepare the update data for the filtered scenes
    const updates = scenesToUpdate.map(scene => {
        const newImgPath = scene.background.src.replace(oldBasePath, newBasePath);
        return { _id: scene.id, img: newImgPath };
    });

    // Update the scenes in bulk, if any
    if (updates.length > 0) {
        await Scene.updateDocuments(updates);
        console.log(`Updated ${updates.length} scene(s) successfully.`);
    } else {
        console.log("No scenes needed updating.");
    }
}

// Run the update function
updateScenePaths();
