import { defaultIcon, ns } from './config';
import { defaultCompositeTransform, parseTransform } from './common';
import { formInfusions } from './generated/formInfusions';
import { formTransforms } from './blastData/formTransforms';
import { substanceInfusions } from './generated/substanceInfusions';
import { substanceTransforms } from './blastData/substanceTransforms';
import { bundledUtilityTalents, utilityTalents } from './generated/utilityTalents';
import { metakinesis } from './generated/metakinesis';
import { simpleBlastsWith3pp } from './generated/simpleBlasts';
import { compositeBlastsWith3pp } from './generated/compositeBlasts';
import { getBaseData } from './blastData/newBlastTemplates';
import { Kineticist } from '../applications/Kineticist';
import { utilityTransforms } from './blastData/utilityTransforms';
import { metaTransforms } from './blastData/metaTransforms';
import { specialTransforms } from './blastData/specialTransforms';

export default class BlastFactory {
    constructor(options) {
        const { formData, actor } = options;
        this.actor = actor;
        this.kineticist = new Kineticist(this.actor);
        this.formData = formData;

        this.blastData = {};
        this.blastConfig = null;
        this.dmgParts = [];
    }

    async runFactory() {
        await this.parseInput();

        console.log('pf1-ke | Start of blastData mutation', this.blastData);
        await this.initBlastData();
        await this.setBaseDamage();

        // Apply custom transform functions on the base blast if found (mainly used for special composite blasts)
        await this.applyBlastTransforms();

        await this.setName();

        // Apply transformations
        await this.applyFormInfusion();
        await this.applySubstanceInfusion();
        await this.applyUtilityTalents();
        await this.applyMetakinesis();
        await this.applyExtraTransforms();

        await this.setItemName();
        // TODO: Set icon here (or find where its already being set and make sure it works)
        await this.setTouchAttack();
        await this.formatDescription();
        await this.setDamage();

        console.log('pf1-ke | Final dmgParts', this.dmgParts);
        console.log('pf1-ke | Damage', this.blastData.system.actions[0].damage);
        console.log('pf1-ke | End of blastData mutation', this.blastData);
    }

    async parseInput() {
        const customFormInfusions = game.settings.get(ns, 'customFormInfusions');
        const customSubstanceInfusions = game.settings.get(ns, 'customSubstanceInfusions');

        // Fetch infusions
        let formInfusion;
        if (this.formData.form.startsWith('custom')) {
            formInfusion = customFormInfusions[this.formData.form.slice(7)];
            if (formInfusion) formInfusion.transform = parseTransform(formInfusion.transform);
        } else {
            formInfusion = formInfusions[this.formData.form];
            if (formInfusion) formInfusion.transform = formTransforms[this.formData.form];
        }

        let substanceInfusion;
        if (this.formData.form.startsWith('custom')) {
            substanceInfusion = customSubstanceInfusions[this.formData.substance.slice(7)];
            if (substanceInfusion) substanceInfusion.transform = parseTransform(substanceInfusion.transform);
        } else {
            substanceInfusion = substanceInfusions[this.formData.substance];
            if (substanceInfusion) substanceInfusion.transform = substanceTransforms[this.formData.substance];
        }

        // Get applied utility talents
        const appliedUtilityTalents = [];
        const utilityKeys = Object.keys(this.formData).filter((k) => k.includes('utility-'));
        const allCustomUtilityTalents = game.settings.get(ns, 'customUtilityTalents') ?? {};
        for (let k of utilityKeys) {
            const talent =
                utilityTalents[this.formData[k]] ??
                bundledUtilityTalents[this.formData[k]] ??
                allCustomUtilityTalents[this.formData[k]];
            if (talent) appliedUtilityTalents.push(talent);
        }

        // Get applied metakinesis
        const appliedMetakinesis = [];
        const metakinesisKeys = Object.keys(this.formData).filter((k) => k.includes('meta-'));
        const allCustomMetakinesis = game.settings.get(ns, 'customMetakinesis') ?? {};
        for (let k of metakinesisKeys) {
            const talent = metakinesis[this.formData[k]] ?? allCustomMetakinesis[this.formData[k]];
            if (talent) appliedMetakinesis.push(talent);
        }

        this.formInfusion = formInfusion;
        this.substanceInfusion = substanceInfusion;
        this.utilityTalents = appliedUtilityTalents;
        this.metakinesis = appliedMetakinesis;
    }

    async initBlastData() {
        // Fetch (or create) template item to copy and morph
        // TODO: Ensure custom blasts are working properly
        const customBlasts = game.settings.get(ns, 'customBlasts');

        let baseBlastItem = (await this.actor.createEmbeddedDocuments('Item', [getBaseData()], { temporary: true }))[0];
        console.log('pf1-ke | baseBlastItem', baseBlastItem);

        // Get blast config from module config
        let blastConfig = simpleBlastsWith3pp[this.formData['blast']];
        if (!blastConfig) blastConfig = compositeBlastsWith3pp[this.formData['blast']];
        if (!blastConfig) blastConfig = customBlasts[this.formData['blast']];
        this.blastConfig = blastConfig;
        console.log('pf1-ke | blastConfig', blastConfig);
        if (!blastConfig) {
            console.error('pf1-ke | Blast Config not found');
            ui.notifications.error('PF1 Kineticist Enhancements | Blast Config not found');
            throw `blastData not found for ${this.formData['blast']}`;
        }

        // Get blast data
        if (baseBlastItem === undefined) {
            console.error('PF1 Kineticist Enhancements | Blast Item not found');
            ui.notifications.error('PF1 Kineticist Enhancements | Blast Item not found');
            return;
        }
        this.blastData = baseBlastItem.toObject();

        // Merge template item with blast config data
        this.blastData = foundry.utils.mergeObject(this.blastData, baseBlastItem);

        // Merge template item with data based on form input
        this.blastData = foundry.utils.mergeObject(this.blastData, {
            img: this.blastConfig.icon ?? defaultIcon,
            system: {
                identifiedName: this.blastConfig.name,
                attackNotes: [],
            },
        });
        // Set icon for action as well as the item
        this.blastData.system.actions[0].img = this.blastConfig.icon ?? defaultIcon;

        // Ensure effect notes exists
        if (!Array.isArray(this.blastData.system.effectNotes)) this.blastData.system.effectNotes = [];
    }

    async setBaseDamage() {
        // Base simple blast
        let BASE = ['(ceil(@classes.kineticist.level / 2))d6', 'Simple'];
        // Elemental Overflow
        let EO = [
            '(min(@resources.classFeat_burn.value, floor(@classes.kineticist.level / 3)) * 2)',
            'Elemental Overflow',
        ];
        // Array of damage parts in the form of [str:damage string, str:description]
        this.dmgParts = [BASE];

        // Add physical blast bonus
        if (this.blastConfig.type === 'physical') {
            this.dmgParts.push([
                this.blastConfig.class === 'composite'
                    ? '@classes.kineticist.level'
                    : 'ceil(@classes.kineticist.level /2)',
                'Physical blast',
            ]);
        }
        // Apply energy penalty
        else {
            this.blastData.system.actions[0].ability.damageMult = 0.5;
        }

        // Add elemental overflow
        this.dmgParts.push(EO);
    }

    async applyBlastTransforms() {
        // Apply custom transform functions if found (mainly used for special composite blasts)
        if (this.blastConfig.transform) {
            [this.dmgParts, this.blastData] = this.blastConfig.transform(
                this.dmgParts,
                this.blastData,
                this.blastConfig,
                this.formData,
            );
        } else if (this.blastConfig.class === 'composite') {
            [this.dmgParts, this.blastData] = defaultCompositeTransform(
                this.dmgParts,
                this.blastData,
                this.blastConfig,
                this.formData,
            );
        }
    }

    async setName() {
        // Set long description
        this.blastData.system.description.value = this.blastConfig.description;
        if (this.formInfusion) this.blastData.system.description.value += ` <hr/>${this.formInfusion.description}`;
        if (this.substanceInfusion)
            this.blastData.system.description.value += ` <hr/>${this.substanceInfusion.description}`;
        this.blastData.system.description.value = this.blastData.system.description.value.replaceAll('\n', '<br/>');

        // Apply changes to name
        if (this.formInfusion?.prepend)
            this.blastData.system.identifiedName = `${this.formInfusion.prependText} ${this.blastData.system.identifiedName}`;
        if (this.formInfusion?.append)
            this.blastData.system.identifiedName = `${this.blastData.system.identifiedName} ${this.formInfusion.appendText}`;
        if (this.substanceInfusion?.prepend)
            this.blastData.system.identifiedName = `${this.substanceInfusion.prependText} ${this.blastData.system.identifiedName}`;
        if (this.substanceInfusion?.append)
            this.blastData.system.identifiedName = `${this.blastData.system.identifiedName} ${this.substanceInfusion.appendText}`;
        if (!this.formInfusion?.noBlastText && !this.substanceInfusion?.noBlastText)
            this.blastData.system.identifiedName += ' Blast';
    }

    async applyFormInfusion() {
        if (this.formInfusion?.transform) {
            const transform = parseTransform(this.formInfusion.transform);
            [this.dmgParts, this.blastData] = transform(
                this,
                this.dmgParts,
                this.blastData,
                this.blastConfig,
                this.formData,
            );
            if (this.blastData.system.actions[0].actionType === 'save')
                this.blastData.system.effectNotes.push(`${this.formInfusion.name} Infusion`);
            else this.blastData.system.attackNotes.push(`${this.formInfusion.name} Infusion`);
        }
    }

    async applySubstanceInfusion() {
        if (this.substanceInfusion?.transform) {
            const transform = parseTransform(this.substanceInfusion.transform);
            [this.dmgParts, this.blastData] = transform(
                this,
                this.dmgParts,
                this.blastData,
                this.blastConfig,
                this.formData,
            );
            if (this.blastData.system.actions[0].actionType === 'save')
                this.blastData.system.effectNotes.push(`${this.substanceInfusion.name} Infusion`);
            else this.blastData.system.attackNotes.push(`${this.substanceInfusion.name} Infusion`);
        }
    }

    async applyUtilityTalents() {
        const customUtilityTalents = game.settings.get(ns, 'customUtilityTalents');
        this.utilityTalents.map((talent) => {
            const transform = utilityTransforms[talent.id] ?? parseTransform(customUtilityTalents[talent.id].transform);
            if (transform)
                [this.dmgParts, this.blastData] = transform(
                    this,
                    this.dmgParts,
                    this.blastData,
                    this.blastConfig,
                    this.formData,
                );
        });
    }

    async applyMetakinesis() {
        const customMetakinesis = game.settings.get(ns, 'customMetakinesis');
        this.metakinesis.map((talent) => {
            const transform = metaTransforms[talent.id] ?? parseTransform(customMetakinesis[talent.id].transform);
            if (transform)
                [this.dmgParts, this.blastData] = transform(
                    this,
                    this.dmgParts,
                    this.blastData,
                    this.blastConfig,
                    this.formData,
                );
        });
    }

    async applyExtraTransforms() {
        // Apply special case transforms
        if (this.formData['double-area'])
            [this.dmgParts, this.blastData] = specialTransforms['double-area'](
                this,
                this.dmgParts,
                this.blastData,
                this.blastConfig,
                this.formData,
            );
        if (this.formData['double-damage'])
            [this.dmgParts, this.blastData] = specialTransforms['double-damage'](
                this,
                this.dmgParts,
                this.blastData,
                this.blastConfig,
                this.formData,
            );
        if (this.formData['skip-templates'])
            [this.dmgParts, this.blastData] = specialTransforms['skip-templates'](
                this,
                this.dmgParts,
                this.blastData,
                this.blastConfig,
                this.formData,
            );
    }

    async formatDescription() {
        // Apply bold to asterisks in descriptions
        this.blastData.system.description.value = this.blastData.system.description.value.replaceAll(
            /\*(.+)\*/g,
            '<b>$1</b>',
        );
    }

    async setTouchAttack() {
        // Add touch attack notes
        if (this.blastData.system.actions[0].actionType === 'save')
            this.blastData.system.attackNotes.push(`${this.blastConfig.type === 'physical' ? 'Not ' : ''}Touch Attack`);
        else
            this.blastData.system.attackNotes.push(`${this.blastConfig.type === 'physical' ? 'Not ' : ''}Touch Attack`);
    }

    async setDamage() {
        // Build damage string
        let damage = '';
        if (this.blastData.flags.baseDamageModified) {
            for (let p of this.dmgParts) damage += ` + ${p[0]}[${p[1]}]`;
        } else {
            damage = `${this.dmgParts[0][0]}[${this.dmgParts[0][1]}]`;
            for (let p of this.dmgParts.slice(1)) {
                if (p[1].includes('Physical ')) damage += ` + (${p[0]})[${p[1]}]`;
                else damage += ` + (${p[0]})[${p[1]}]`;
            }
        }
        // TODO: Find where I should add the full name of the infusion to the attack nodes as 'X Infusion'

        // Set damage string
        this.blastData.system.actions[0].damage.parts[0] = {
            formula: damage,
            type: { values: this.blastConfig.damageType },
        };
    }

    async setItemName() {
        this.blastData.name = this.blastData.system.identifiedName;
    }

    async getDocument() {
        return (await this.actor.createEmbeddedDocuments('Item', [this.blastData], { temporary: true }))[0];
    }
}
