import { ns } from '../lib/config';
import { defaultCompositeTransform, getCompositeBlasts, jquery } from '../lib/common';
import { metaTransforms } from '../lib/blastData/metaTransforms';
import { simpleBlastsAsArray, simpleBlastsWith3pp } from '../lib/generated/simpleBlasts';
import { compositeBlasts, compositeBlastsWith3pp } from '../lib/generated/compositeBlasts';
import { formInfusions } from '../lib/generated/formInfusions';
import { formTransforms } from '../lib/blastData/formTransforms';
import { substanceInfusions } from '../lib/generated/substanceInfusions';
import { substanceTransforms } from '../lib/blastData/substanceTransforms';
import { metakinesis } from '../lib/generated/metakinesis';
import { utilityTalents, utilityTalentsAsArray } from '../lib/generated/utilityTalents';
import { utilityTransforms } from '../lib/blastData/utilityTransforms';
import { getBaseData } from '../lib/blastData/newBlastTemplates';
import { Kineticist } from './Kineticist';
import { feats, mythicFeats } from '../lib/blastData/feats';
import { specialTransforms } from '../lib/blastData/specialTransforms';

export class ApplicationBlastAttack extends FormApplication {
    constructor(options = {}) {
        super(options);
        this.actor = options.actor;
        this.kineticist = new Kineticist(this.actor);
        //if (options.actor) {}
    }

    // TODO: Clean up flow.  Maybe separate out some into functions.  Maybe make full pipeline that inputs blastData and outputs blastData<modified> for each thing.
    // TODO: Make HUD align with TokenActionHUD or even integrate into it

    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            id: `ke-blast-attack`,
            classes: [ns],
            template: `modules/${ns}/templates/blast-attack.hbs`,
            width: 1350,
            height: 600,
            resizable: true,
            title: 'Kinetic Blast Attack',
        });
    }

    async close(options) {
        return super.close(options);
    }

    getData() {
        // Get list of all wild talents and owned wild talents and compare
        const actorConfig = this.actor.getFlag(ns, 'actorConfig');

        // Set owned simple blasts
        const ownedSimpleBlasts = simpleBlastsAsArray(true).filter((b) => {
            if (actorConfig.simple.indexOf(b.id) > -1) return b;
        });

        // Set owned form infusions
        let allFormInfusions = formInfusions;
        let ownedFormInfusions = [];
        for (let key of Object.keys(allFormInfusions)) {
            if (actorConfig.form.indexOf(key) > -1) ownedFormInfusions.push(allFormInfusions[key]);
        }

        // Set owned substance infusions
        let allSubstanceInfusions = substanceInfusions;
        let ownedSubstanceInfusions = [];
        for (let key of Object.keys(allSubstanceInfusions)) {
            if (actorConfig.substance.indexOf(key) > -1) ownedSubstanceInfusions.push(allSubstanceInfusions[key]);
        }

        // Get all owned utility talents
        let activeUtilityIDs = this.actor.getFlag(ns, 'attack-utilityTalents') ?? [];
        const ownedUtilityTalents = utilityTalentsAsArray().filter((b) => {
            if (actorConfig.utility.indexOf(b.id) > -1) return b;
        });
        const activeUtilityTalents = ownedUtilityTalents.map((b) => {
            b.active = activeUtilityIDs.indexOf(b.id) > -1 ? 'checked' : '';
            return b;
        });
        const flags = this.kineticist.getBurnFlags();

        const gatherTemplate = {
            none: { name: 'None', id: 'none' },
            swift: { name: 'Swift Action', id: 'swift' },
            move: { name: 'Move Action', id: 'move' },
            move2: { name: '2 Move Actions', id: 'move2' },
            move3: { name: '3 Move Actions', id: 'move3' },
            standard: { name: 'Standard Action', id: 'standard' },
            full: { name: 'Full-Round Action', id: 'full' },
            fullmove: { name: 'Full+Move Action', id: 'fullmove' },
        };
        const gatherBurn = this.kineticist.getGatherPowerReductions();
        const gather = {};
        for (let key in gatherTemplate) {
            if (gatherBurn[key] > 0) gather[key] = { ...gatherTemplate[key], burn: gatherBurn[key] };
        }

        const allFeats = Object.values(feats).concat(Object.values(mythicFeats));
        const ownedFeats = allFeats.filter((f) => {
            return flags[f.id];
        });

        return foundry.utils.mergeObject(super.getData(), {
            actor: this.actor,
            simple: ownedSimpleBlasts,
            composite: getCompositeBlasts(ownedSimpleBlasts, true),
            formInfusions: ownedFormInfusions,
            substanceInfusions: ownedSubstanceInfusions,
            utilityTalents: activeUtilityTalents,
            metakinesis: metakinesis,
            feats: ownedFeats,
            infusionSpecialization: this.kineticist.getInfusionSpecialization(),
            flags: flags, // TODO: use flags instead of the variables below
            gather: Object.values(gather),
            burn: this.kineticist.getBurn(),
            compositeSpecializationActive: this.actor.classes.kineticist.level >= 16,
            actorFlags: this.actor.flags[ns],
            // TODO: just move these to some onload or something or figure out handlebar/conditionals better
        });
    }

    async getBaseBlast() {
        return (await this.actor.createEmbeddedDocuments('Item', getBaseData(), { temporary: true }))[0];
    }

    async _asyncUpdateObject(event, formData) {
        // Fetch (or create) template item to copy and morph
        let blastItem = await this.getBaseBlast();
        console.log('Foundry VTT | blastItem', blastItem);

        // Get blast config from module config
        let blastConfig = simpleBlastsWith3pp[formData['blast']];
        if (!blastConfig) blastConfig = compositeBlastsWith3pp[formData['blast']];
        console.log('Foundry VTT | blastConfig', blastConfig);

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
            console.error('Foundry VTT | Blast Item not found', blastItem);
            return;
        }
        let blastData = blastItem.toObject();

        console.log('Foundry VTT | Start of blastData mutation', blastData);
        // Merge template item with blast config data
        blastData = foundry.utils.mergeObject(blastData, getBaseData());

        // Merge template item with data based on form input
        blastData = foundry.utils.mergeObject(blastData, {
            //name: `${blastConfig.name}`,
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
            '(min(@resources.classFeat_burn.value  , floor(@classes.kineticist.level /3))*2)',
            'Elemental Overflow',
        ];
        // Array of damage parts in the form of [str:damage string, str:description]
        let dmgParts = [BASE];

        // Add physical bonus
        if (blastConfig.type === 'physical') {
            dmgParts.push([
                blastConfig.class === 'composite' ? '@classes.kineticist.level' : 'ceil(@classes.kineticist.level /2)',
                'Physical blast',
            ]);
        }
        // Apply energy penalty
        else {
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
        for (let key of Object.keys(formData)) {
            // If the key starts with meta and the key is checked
            //console.error('key', key, formData[key], typeof formData[key])
            if (key.startsWith('meta-') && formData[key] != null) {
                // Run blastData through the meta action
                metaTransforms[key.slice(5)](this, dmgParts, blastData, blastConfig, formData);
            }
        }

        // Apply special case transforms
        if (formData['double-area'])
            [dmgParts, blastData] = specialTransforms['double-area'](this, dmgParts, blastData, blastConfig, formData);
        if (formData['double-damage'])
            [dmgParts, blastData] = specialTransforms['double-damage'](
                this,
                dmgParts,
                blastData,
                blastConfig,
                formData,
            );
        if (formData['skip-templates'])
            [dmgParts, blastData] = specialTransforms['skip-templates'](
                this,
                dmgParts,
                blastData,
                blastConfig,
                formData,
            );

        // Build damage string
        let damage = '';
        if (blastData.flags.baseDamageModified) {
            for (let p of dmgParts) damage += ` + ${p[0]} [${p[1]}]`;
        } else {
            damage = `${dmgParts[0][0]}`;
            for (let p of dmgParts.slice(1)) damage += ` + ${p[0]} [${p[1]}]`;
        }

        // Set damage string
        blastData.system.actions[0].damage.parts[0] = {
            formula: damage,
            type: { values: blastConfig.damageType },
        };

        blastData.name = blastData.system.identifiedName;

        console.log('Foundry VTT | End of blastData mutation', blastData);

        // Create new item from data
        const newBlast = (await this.actor.createEmbeddedDocuments('Item', [blastData], { temporary: true }))[0];

        // Save inputs
        this.actor.setFlag(ns, 'remember-gather', formData['remember-gather']);
        if (formData['remember-gather']) this.actor.setFlag(ns, 'remember-gather-value', formData['gather']);
        this.actor.setFlag(ns, 'remember-blast', formData['remember-blast']);
        if (formData['remember-blast']) this.actor.setFlag(ns, 'remember-blast-value', formData['blast']);
        this.actor.setFlag(ns, 'remember-form', formData['remember-form']);
        if (formData['remember-form']) this.actor.setFlag(ns, 'remember-form-value', formData['form']);
        this.actor.setFlag(ns, 'remember-substance', formData['remember-substance']);
        if (formData['remember-substance']) this.actor.setFlag(ns, 'remember-substance-value', formData['substance']);
        this.actor.setFlag(ns, 'remember-meta', formData['remember-meta']);
        if (formData['remember-meta']) {
            const activeMetaIDs = [];
            for (let key in formData)
                if (key.startsWith('meta-') && formData[key]) activeMetaIDs.push(key.substring(5));
            this.actor.setFlag(ns, 'remember-meta-value', activeMetaIDs);
        }
        this.actor.setFlag(ns, 'remember-utility', formData['remember-utility']);
        if (formData['remember-utility']) {
            const activeMetaIDs = [];
            for (let key in formData)
                if (key.startsWith('utility-') && formData[key]) activeMetaIDs.push(key.substring(8));
            this.actor.setFlag(ns, 'remember-utility-value', activeMetaIDs);
        }

        this.actor.setFlag(ns, 'remember-apply-burn', formData['apply-burn']);
        this.actor.setFlag(ns, 'remember-skip-templates', formData['skip-templates']);
        this.actor.setFlag(ns, 'remember-double-damage', formData['double-damage']);
        this.actor.setFlag(ns, 'remember-double-area', formData['double-area']);

        // if (formData['remember-meta']) {
        //     this.actor.setFlag(ns, 'remember-meta', true);
        //     this.actor.setFlag(ns, 'remember-meta-value', formData['blast']);
        // }
        // if (formData['remember-utility']) {
        //     this.actor.setFlag(ns, 'remember-utility', true);
        //     this.actor.setFlag(ns, 'remember-utility-value', formData['blast']);
        // }

        // Pull up the dialog to use the blast
        try {
            console.log('Foundry VTT | newBlast', newBlast);
            await newBlast.use({ skipDialog: false });
            if (formData['apply-burn']) await this.kineticist.addBurn(formData['burn']);
        } catch (err) {
            console.error('Foundry VTT | Error using new item', err);
        }
    }
    // actor.system.resources.classFeat_burn.value,max,_id

    _updateObject(event, formData) {
        this._asyncUpdateObject(event, formData);
    }

    updateForm() {
        let formInfusion = formInfusions[$('#ke-blast-attack input[name="form"]:checked').val()];
        let substanceInfusion = substanceInfusions[$('#ke-blast-attack input[name="substance"]:checked').val()];
        let burnCost = 0;

        const flags = this.kineticist.getBurnFlags();

        // Apply infusion cost and reductions
        let infusionCost = -this.kineticist.getInfusionSpecialization();
        infusionCost += parseInt(formInfusion?.burn ?? 0);
        infusionCost += parseInt(substanceInfusion?.burn ?? 0);
        infusionCost = Math.max(0, infusionCost); // Don't let Infusion Specialization reduce below 0
        burnCost += infusionCost;

        // Apply composite blast cost and reductions
        const selectedBlast = $('#ke-blast-attack input[name="blast"]:checked').val();
        const blast = compositeBlastsWith3pp[selectedBlast] ?? simpleBlastsWith3pp[selectedBlast];
        let blastCost = blast?.burn ?? 0;
        if (this.kineticist.getLevel() >= 16) blastCost -= 1;
        blastCost = Math.max(0, blastCost); // Don't let Infusion Specialization reduce below 0
        burnCost += blastCost;

        // Apply metakinesis cost and reductions
        let metaCost = 0;
        $('#ke-blast-attack input[name^="meta-"]:checked').each((i, elem) => {
            const m = metakinesis[elem.id.substring(5)];
            if (m) metaCost += parseInt(m.burn) ?? 0;
        });
        metaCost = Math.max(0, metaCost);
        burnCost += metaCost;
        // TODO: Apply Metakinetic Master here

        // Apply reduction from gather power
        const selectedGather = $('#ke-blast-attack input[name="gather"]:checked').val();
        const reductions = this.kineticist.getGatherPowerReductions();
        burnCost -= reductions[selectedGather] ?? 0;

        if (burnCost < 0) {
            $('#burn').val('0');
            $('#burn-cost').text(`0 (${burnCost})`);
        } else {
            $('#burn').val(`${burnCost}`);
            $('#burn-cost').text(burnCost);
        }
    }

    loadForm() {
        if (this.actor.getFlag(ns, 'remember-gather'))
            $(`#gather-${this.actor.getFlag(ns, 'remember-gather-value')}`).prop('checked', true);
        if (this.actor.getFlag(ns, 'remember-blast'))
            $(`#${this.actor.getFlag(ns, 'remember-blast-value')}`).prop('checked', true);
        if (this.actor.getFlag(ns, 'remember-form'))
            $(`#form-${this.actor.getFlag(ns, 'remember-form-value')}`).prop('checked', true);
        if (this.actor.getFlag(ns, 'remember-substance'))
            $(`#substance-${this.actor.getFlag(ns, 'remember-substance-value')}`).prop('checked', true);
    }

    activateListeners(html) {
        super.activateListeners(html);
        html.on('click', 'input', void 0, () => this.updateForm());
        html.find('#ke-managed-blast').ready(this.loadForm());
    }
}
