export const getCoreMajorVersion = () => {
    if (game.version) return parseInt(game.version.split('.')[0]);
    return true;
};
