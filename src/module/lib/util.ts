import { ns } from './config';

// keyof of an index signature includes number; Extract<string> narrows it to string.
type KEKeys = Extract<keyof ClientSettings.Values[typeof ns], string>;

export const getSetting = (key: KEKeys) => {
  return game.settings!.get(ns, key);
};

export const setSetting = (key: KEKeys, value: unknown) => {
  return game.settings!.set(ns, key, value);
};

export const getCoreMajorVersion = () => {
  if (game.version) return parseInt(game.version.split('.')[0]);
  return 13;
};

export const parseBurn = (burn?: string | null | number) => {
    const value = parseInt(`${burn ?? 0}`);
    if (isNaN(value)) return 0;
    return value;
}
