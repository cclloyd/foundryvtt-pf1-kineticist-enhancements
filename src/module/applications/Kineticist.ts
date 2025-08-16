import { substanceInfusions } from '../lib/generated/substanceInfusions';
import { ns } from '../lib/config';
import { utilityTalentsAsArray } from '../lib/generated/utilityTalents';
import type {GatherPower} from "#ke/types/kineticist";
import type {FeatConfig, FeatConfigs} from "#ke/types/feats";
import type {KineticistActorConfig} from "#ke/types/actor";

export class Kineticist {
    actor: Actor;

    constructor(actor: Actor) {
        this.actor = actor;
    }

    getInfusionSpecialization() {
        const completedIntervals = Math.max(this.actor.classes.kineticist.level - 5, 0) / 3;
        const totalPoints = 1 + Math.floor(completedIntervals);
        return Math.max(totalPoints, 0);
    }

    getLevel() {
        return this.actor.classes.kineticist.level;
    }

    getClassFeature(identifier: string) {
        const items = this.actor.items.filter((item) => item.system.tag === identifier);
        if (items.length > 0) return items[0];
        return null;
    }

    getClassFeatureByName(featureName: string) {
        const items = this.actor.items.filter((item) => item.name === featureName);
        if (items.length > 0) return items[0];
        return null;
    }

    async addBurn(amount: number) {
        let burn = this.getClassFeature('classFeat_burn'); // returns the Item object
        const newBurn = { _id: burn._id, system: { uses: { value: parseInt(amount) + burn.system.uses.value } } };
        await this.actor.updateEmbeddedDocuments('Item', [newBurn]);
    }

    getGatherPowerReductions() {
        // Generates an object with the action type and burn reductions, based on feats
        const flags = this.getBurnFlags() as any;
        let gather: GatherPower = {
            move: 1,
            full: 2,
            fullmove: 3,
        };
        if (flags.acceleratedGathering) {
            gather.standard = gather.full;
        }
        if (flags.mythicGatherPower) {
            gather.swift = gather.move;
        }
        if (flags.mythicCelerity || flags.mythicHaste) {
            gather.move2 = gather.move;
        }
        if (flags.flashStep) {
            if (gather.move2) gather.move3 = gather.move;
            else gather.move2 = gather.move;
        }
        if (flags.supercharge) {
            const increase = flags.mythicSupercharge ? 2 : 1;
            for (let key in gather) gather[key as keyof GatherPower] += increase;
        }
        if (flags.kineticAcceleration && (flags.haste || flags.celerity || flags.mythicCelerity)) {
            for (let key in gather) gather[key as keyof GatherPower] += 1;
        }

        // Increase extra moves after they get their other increases
        if (gather.move2) gather.move2 *= 2;
        if (gather.move3) gather.move3 *= 3;
        return gather;
    }

    checkFeat(inputFeat: string | FeatConfig, featTag: string) {
        if (inputFeat === featTag) return true;
        else if (inputFeat === `feat_${featTag}`) return true;
        else if (inputFeat === `classFeat_${featTag}`) return true;
        return false;
    }

    getBurnFlags() {
        const flags = {} as any;

        // Go through items to automatically map stuff from sheet
        this.actor.items.map((item) => {
            // Class Features
            if (this.checkFeat(item.system.tag, 'compositeSpecialization')) flags['compositeSpecialization'] = true;
            else if (this.checkFeat(item.system.tag, 'flashStep')) flags['flashStep'] = true;
            else if (this.checkFeat(item.system.tag, 'metakineticMaster')) flags['metakineticMaster'] = true;
            else if (this.checkFeat(item.system.tag, 'supercharge')) flags['supercharge'] = true;
            // Feats
            else if (this.checkFeat(item.system.tag, 'acceleratedGathering')) flags['acceleratedGathering'] = true;
            else if (this.checkFeat(item.system.tag, 'kineticAcceleration')) flags['kineticAcceleration'] = true;
            // Mythic
            else if (this.checkFeat(item.system.tag, 'mythicGatherPower')) flags['mythicGatherPower'] = true;
            else if (this.checkFeat(item.system.tag, 'mythicSupercharge')) flags['mythicSupercharge'] = true;
            // Buffs
            else if (this.checkFeat(item.system.tag, 'haste')) flags['haste'] = item.system.active;
            else if (this.checkFeat(item.system.tag, 'celerity')) flags['celerity'] = item.system.active;
            else if (this.checkFeat(item.system.tag, 'mythicHaste')) flags['mythicHaste'] = item.system.active;
            else if (this.checkFeat(item.system.tag, 'mythicCelerity')) flags['mythicCelerity'] = item.system.active;
        });

        // Also check manually checked stuff from module
        // @ts-ignore
        const actorConfig = this.actor.getFlag(ns, 'actorConfig') as KineticistActorConfig;
        // Get all owned utility talents
        const ownedUtilityTalents = utilityTalentsAsArray().filter((b) => {
            if (actorConfig.utility.indexOf(b.id) > -1) return b;
        });
        for (let talent of ownedUtilityTalents) flags[talent.id] = true;

        return flags;
    }

    getBurn() {
        const burnValues = this.actor.items
            .map((item) => {
                if (item.system.tag === 'classFeat_burn') return item.system.uses.value;
            })
            .filter((i) => i !== undefined);
        if (burnValues.length > 0) return burnValues[0];
        return 0;
    }
}
