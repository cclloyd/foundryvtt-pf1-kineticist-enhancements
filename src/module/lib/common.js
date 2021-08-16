import {config} from "./config";

export const sleep = (time) => {
  return new Promise((resolve) => setTimeout(resolve, time));
}

export const debug = () => {
  CONFIG.debug.hooks = true;
}

export const getAllPlayersActors = async () => {
  let actors = game.actors.entities.filter(o => o.hasPlayerOwner);
  console.debug('Actors:', actors)
  return actors;
}

export const getSimpleBlasts = () => {
  const blasts = []
  for (let key of Object.keys(config.blasts.simple)) {
    blasts.push(config.blasts.simple[key])
  }
  return blasts;
}
