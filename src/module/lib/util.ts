import { ns } from './config';

// keyof of an index signature includes number; Extract<string> narrows it to string.
type KEKeys = Extract<keyof ClientSettings.Values[typeof ns], string>;

export const getSetting = (key: KEKeys) => {
  return game.settings!.get(ns, key);
};

export const setSetting = (key: KEKeys, value: unknown) => {
  return game.settings!.set(ns, key, value);
};