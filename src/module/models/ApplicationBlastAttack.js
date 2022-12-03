import { ns } from '../lib/config';
import { defaultCompositeTransform, getCompositeBlasts } from '../lib/common';
import { metaTransforms } from '../lib/blastData/metaTransforms';
import { simpleBlasts, simpleBlastsAsArray, simpleBlastsWith3pp } from '../lib/generated/simpleBlasts';
import { compositeBlastsWith3pp } from '../lib/generated/compositeBlasts';
import { formInfusions } from '../lib/generated/formInfusions';
import { formTransforms } from '../lib/blastData/formTransforms';
import { substanceInfusions } from '../lib/generated/substanceInfusions';
import { substanceTransforms } from '../lib/blastData/substanceTransforms';
import { metakinesis } from '../lib/generated/metakinesis';
import { utilityTalents, utilityTalentsAsArray } from '../lib/generated/utilityTalents';
import { utilityTransforms } from '../lib/blastData/utilityTransforms';
import { getBaseData } from '../lib/blastData/newBlastTemplates';

export class ApplicationBlastAttack extends FormApplication {
    constructor(options = {}) {
        super(options);
        this.actor = options.actor;
        //if (options.actor) {}
    }

    // TODO: Clean up flow.  Maybe separate out some into functions.  Maybe make full pipeline that inputs blastData and outputs blastData<modified> for each thing.
    // TODO: Make HUD align with TokenActionHUD or even integrate into it

    /**
     * Default Application options
     *
     * @returns {object} options - Application options.
     * @see https://foundryvtt.com/api/Application.html#options
     */
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: `ke-blast-attack`,
            classes: [ns],
            template: `modules/${ns}/templates/blast-attack.hbs`,
            width: 1130,
            height: 500,
            resizable: true,
            title: 'Kinetic Blast Attack',
        });
    }

    /**
     * Handle closing any confirm delete quest dialog attached to QuestLog.
     *
     * @override
     * @inheritDoc
     */
    async close(options) {
        return super.close(options);
    }

    /**
     * @override
     * @inheritDoc
     * @see https://foundryvtt.com/api/FormApplication.html#getData
     */
    getData() {
        // Get list of all wild talents and owned wild talents and compare
        let ownedSimpleIDs = this.actor.getFlag(ns, 'simpleBlasts');
        // Populate and set flag if not yet defined.
        if (ownedSimpleIDs === undefined) {
            this.actor.setFlag(ns, 'simpleBlasts', []);
            ownedSimpleIDs = [];
        }

        // Set owned simple blasts
        const ownedSimpleBlasts = simpleBlastsAsArray(true).filter((b) => {
            if (ownedSimpleIDs.indexOf(b.id) > -1) return b;
        });

        // Get list of all form infusions and owned form infusions and compare
        let ownedFormIDs = this.actor.getFlag(ns, 'formInfusions') ?? [];
        let ownedSubstanceIDs = this.actor.getFlag(ns, 'substanceInfusions') ?? [];

        // Set owned form infusions
        let allFormInfusions = formInfusions;
        let ownedFormInfusions = [];
        for (let key of Object.keys(allFormInfusions)) {
            if (ownedFormIDs.indexOf(key) > -1) ownedFormInfusions.push(allFormInfusions[key]);
        }

        // Set owned substance infusions
        let allSubstanceInfusions = substanceInfusions;
        let ownedSubstanceInfusions = [];
        for (let key of Object.keys(allSubstanceInfusions)) {
            if (ownedSubstanceIDs.indexOf(key) > -1) ownedSubstanceInfusions.push(allSubstanceInfusions[key]);
        }

        // Get all owned utility talents
        let ownedUtilityIDs = this.actor.getFlag(ns, 'utilityTalents');
        let activeUtilityIDs = this.actor.getFlag(ns, 'attack-utilityTalents') ?? [];
        const ownedUtilityTalents = utilityTalentsAsArray().filter((b) => {
            if (ownedUtilityIDs.indexOf(b.id) > -1) return b;
        });
        const activeUtilityTalents = ownedUtilityTalents.map((b) => {
            b.active = activeUtilityIDs.indexOf(b.id) > -1 ? 'checked' : '';
            return b;
        });

        return foundry.utils.mergeObject(super.getData(), {
            actor: this.actor,
            simple: ownedSimpleBlasts,
            composite: getCompositeBlasts(ownedSimpleBlasts, true),
            formInfusions: ownedFormInfusions,
            substanceInfusions: ownedSubstanceInfusions,
            utilityTalents: activeUtilityTalents,
            metakinesis: metakinesis,
        });
    }

    async getBaseBlast() {
        return (await this.actor.createEmbeddedDocuments('Item', getBaseData(), { temporary: true }))[0];
    }

    async _asyncUpdateObject(event, formData) {
        // Fetch (or create) template item to copy and morph
        let blastItem = await this.getBaseBlast();
        console.log('blastItem', blastItem);

        // Get blast config from module config
        let blastConfig = simpleBlastsWith3pp[formData['blast']];
        if (!blastConfig) blastConfig = compositeBlastsWith3pp[formData['blast']];
        console.log('blastConfig', blastConfig);

        // Get utility info early to save it to remember later
        const activeUtilityIDs = [];
        for (let key in formData)
            if (key.startsWith('utility-') && formData[key]) activeUtilityIDs.push(key.substring(8));
        this.actor.setFlag(ns, 'attack-utilityTalents', activeUtilityIDs);

        const allUtilityTalents = utilityTalents;
        for (let key of Object.keys(utilityTalents))
            allUtilityTalents[key].owned = activeUtilityIDs.indexOf(allUtilityTalents[key].id) > -1 ? 'checked' : '';
        const activeUtilityTalents = Object.entries(allUtilityTalents)
            .map((i) => i[1])
            .filter((i) => i.owned === 'checked');

        // Get blast data
        if (blastItem === undefined) {
            console.error('Blast Item not found', blastItem);
            return;
        }
        let blastData = blastItem.toObject();

        console.log('Start of blastData mutation', blastData);
        // Merge template item with blast config data
        blastData = foundry.utils.mergeObject(blastData, getBaseData());

        // Merge template item with data based on form input
        blastData = foundry.utils.mergeObject(blastData, {
            name: `${blastConfig.name}`,
            img: blastConfig.icon,
        });
        blastData.system.identifiedName = blastConfig.name;

        // Create empty attack notes in case it doesn't exist
        blastData.system.attackNotes = [];

        // TODO: Create pipeline of functions that accept blastData, formData as input and output modified blastData
        // Base simple blast
        let BASE = ['ceil(@classes.kineticist.level /2)d6', 'Simple'];
        // Elemental Overflow
        let EO = [
            '(min(@resources.burn.max - @resources.burn.value , floor(@classes.kineticist.level /3))*2)',
            'Elemental Overflow',
        ];
        // Physical blast bonus
        let PB = ['@classes.kineticist.level', 'Physical blast'];
        // Array of damage parts in the form of [str:damage string, str:description]
        let dmgParts = [BASE];

        // Add physical bonus
        if (blastConfig.type === 'physical') {
            dmgParts.push(PB);
        } else {
            blastData.system.actions[0].ability.damageMult = 0.5;
        }

        // Add elemental overflow
        dmgParts.push(EO);

        // Apply custom transform function if found (mainly used for special composite blasts)
        if (blastConfig.transform) {
            [dmgParts, blastData] = blastConfig.transform(dmgParts, blastData, blastConfig, formData);
        } else if (blastConfig.class === 'composite') {
            [dmgParts, blastData] = defaultCompositeTransform(dmgParts, blastData, blastConfig, formData);
        }

        // Fetch infusions
        let formInfusion = formInfusions[formData.form];
        let formTransform = formTransforms[formData.form];
        let substanceInfusion = substanceInfusions[formData.substance];
        let substanceTransform = substanceTransforms[formData.substance];

        // Set long description
        blastData.system.description.value = blastConfig.description;
        if (formInfusion) blastData.system.description.value += ` <hr/>${formInfusion.description}`;
        if (substanceInfusion) blastData.system.description.value += ` <hr/>${substanceInfusion.description}`;
        blastData.system.description.value = blastData.system.description.value.replaceAll('\n', '<br/>');

        // Apply changes to name
        if (formInfusion?.prepend)
            blastData.system.identifiedName = `${formInfusion.prependText} ${blastData.system.identifiedName}`;
        if (formInfusion?.append)
            blastData.system.identifiedName = `${blastData.system.identifiedName} ${formInfusion.appendText}`;
        if (substanceInfusion?.prepend)
            blastData.system.identifiedName = `${substanceInfusion.prependText} ${blastData.system.identifiedName}`;
        if (substanceInfusion?.append)
            blastData.system.identifiedName = `${blastData.system.identifiedName} ${substanceInfusion.appendText}`;
        if (!formInfusion?.noBlastText && !substanceInfusion?.noBlastText) blastData.system.identifiedName += ' Blast';

        // Apply transformations
        if (!Array.isArray(blastData.system.effectNotes)) blastData.system.effectNotes = [];
        if (formTransform) {
            [dmgParts, blastData] = formTransform(this, dmgParts, blastData, blastConfig, formData);
            if (blastData.system.actions[0].actionType === 'save')
                blastData.system.effectNotes.push(`${formInfusion.name} Infusion`);
            else blastData.system.attackNotes.push(`${formInfusion.name} Infusion`);
        }
        if (substanceTransform) {
            [dmgParts, blastData] = substanceTransform(this, dmgParts, blastData, blastConfig, formData);
            if (blastData.system.actions[0].actionType === 'save')
                blastData.system.effectNotes.push(`${substanceInfusion.name} Infusion`);
            else blastData.system.attackNotes.push(`${substanceInfusion.name} Infusion`);
        }

        // Apply bold to asterisks in descriptions
        blastData.system.description.value = blastData.system.description.value.replaceAll(/\*(.+)\*/g, '<b>$1</b>');

        // Add touch attack notes
        if (blastData.system.actions[0].actionType === 'save')
            blastData.system.attackNotes.push(`${blastConfig.type === 'physical' ? 'Not ' : ''}Touch Attack`);
        else blastData.system.attackNotes.push(`${blastConfig.type === 'physical' ? 'Not ' : ''}Touch Attack`);

        // TODO: Add option on form to roll damage as 1/2 or 1/4 damage (no attack roll)

        // Apply utility talents
        activeUtilityTalents.map((talent) => {
            [dmgParts, blastData] = utilityTransforms[talent.id](this, dmgParts, blastData, blastConfig, formData);
        });

        // Apply metakinesis
        console.error('Checking for metakinesis');
        for (let key of Object.keys(formData)) {
            // If the key starts with meta and the key is checked
            //console.error('key', key, formData[key], typeof formData[key])
            if (key.startsWith('meta-') && formData[key] != null) {
                // Run blastData through the meta action
                metaTransforms[key.slice(5)](this, dmgParts, blastData, blastConfig, formData);
            }
        }

        // Build damage string
        let damage = `${dmgParts[0][0]}`;
        if (dmgParts.length > 1) {
            for (let p of dmgParts.slice(1)) {
                damage += ` + ${p[0]}[${p[1]}]`;
            }
        }

        // Set damage string
        blastData.system.actions[0].damage.parts[0] = [damage, { values: blastConfig.damageType }];
        console.log('damage type', blastData.system.actions[0].damage.parts[0]);

        console.log('End of blastData mutation', blastData);

        // Create new item from data
        const newBlast = (await this.actor.createEmbeddedDocuments('Item', [blastData], { temporary: true }))[0];

        // Pull up the dialog to use the blast
        try {
            console.log('newBlast', newBlast);
            await newBlast.use({ skipDialog: false });
        } catch (err) {
            console.error('Error using new item', err);
        }
    }

    _updateObject(event, formData) {
        this._asyncUpdateObject(event, formData);
    }

    /**
     * Defines all jQuery control callbacks with event listeners for click, drag, drop via various CSS selectors.
     *
     * @param {JQuery}  html - The jQuery instance for the window content of this Application.
     *
     * @see https://foundryvtt.com/api/FormApplication.html#activateListeners
     */
    activateListeners(html) {
        super.activateListeners(html);
    }
}
