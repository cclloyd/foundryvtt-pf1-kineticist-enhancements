import { substanceInfusions } from '../lib/generated/substanceInfusions';
import { ns } from '../lib/config';
import { utilityTalentsAsArray } from '../lib/generated/utilityTalents';

export class Kineticist {
    constructor(actor) {
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

    getClassFeature(featureName) {
        const items = this.actor.items.filter((item) => item.name === featureName);
        if (items.length > 0) return items[0];
        return null;
    }

    getGatherPowerReductions() {
        const flags = this.getBurnFlags();
        let gather = {
            //swift: 1,
            move: 1,
            //standard: 2,
            full: 2,
            fullmove: 3,
        };
        if (flags.feat_acceleratedGathering) {
            gather.standard = gather.full;
        }
        if (flags.feat_mythicGatherPower) {
            gather.swift = gather.move;
        }
        if (flags.mythicCelerity || flags.mythicHaste) {
            gather.move2 = gather.move;
        }
        if (flags.classFeat_flashStep) {
            if (gather.move2) gather.move3 = gather.move;
            else gather.move2 = gather.move;
        }
        if (flags.classFeat_supercharge) {
            const increase = flags.feat_mythicSupercharge ? 2 : 1;
            for (let key in gather) gather[key] += increase;
        }
        if (flags.feat_kineticAcceleration && (flags.haste || flags.celerity || flags.mythicCelerity)) {
            for (let key in gather) gather[key] += 1;
        }

        // Increase extra moves after they get their other increases
        if (gather.move2) gather.move2 *= 2;
        if (gather.move3) gather.move3 *= 3;
        return gather;
    }

    getBurnFlags() {
        const flags = {};

        // Go through items to automatically map stuff from sheet
        this.actor.items.map((item) => {
            // Class Features
            if (item.system.tag === 'classFeat_compositeSpecialization')
                flags['classFeat_compositeSpecialization'] = true;
            else if (item.system.tag === 'classFeat_flashStep') flags['classFeat_flashStep'] = true;
            else if (item.system.tag === 'classFeat_metakineticMaster') flags['classFeat_metakineticMaster'] = true;
            else if (item.system.tag === 'classFeat_supercharge') flags['classFeat_supercharge'] = true;
            // Feats
            else if (item.system.tag === 'feat_acceleratedGathering') flags['feat_acceleratedGathering'] = true;
            else if (item.system.tag === 'feat_kineticAcceleration') flags['feat_kineticAcceleration'] = true;
            // Mythic
            else if (item.system.tag === 'feat_mythicGatherPower') flags['feat_mythicGatherPower'] = true;
            else if (item.system.tag === 'feat_mythicSupercharge') flags['feat_mythicSupercharge'] = true;
            // Buffs
            else if (item.system.tag === 'haste') flags['haste'] = item.system.active;
            else if (item.system.tag === 'celerity') flags['celerity'] = item.system.active;
            else if (item.system.tag === 'mythicHaste') flags['mythicHaste'] = item.system.active;
            else if (item.system.tag === 'mythicCelerity') flags['mythicCelerity'] = item.system.active;
        });

        // Also check manually checked stuff from module
        const actorConfig = this.actor.getFlag(ns, 'actorConfig');
        // Get all owned utility talents
        const ownedUtilityTalents = utilityTalentsAsArray().filter((b) => {
            if (actorConfig.utility.indexOf(b.id) > -1) return b;
        });
        for (let talent of ownedUtilityTalents) flags[talent] = true;

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
