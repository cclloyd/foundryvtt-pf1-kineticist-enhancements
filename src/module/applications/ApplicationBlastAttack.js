import { ns } from '../lib/config';
import { defaultCompositeTransform, getCompositeBlasts, jquery, parseTransform } from '../lib/common';
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
import { getBaseData, getDefaultAction } from '../lib/blastData/newBlastTemplates';
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

        // Set owned custom blasts
        const allCustomBlasts = game.settings.get(ns, 'customBlasts') ?? {};
        const allCustomSimpleBlasts = Object.fromEntries(
            Object.entries(allCustomBlasts).filter(([key, value]) => value.class === 'simple'),
        );
        const allCustomCompositeBlasts = Object.fromEntries(
            Object.entries(allCustomBlasts).filter(([key, value]) => value.class === 'composite'),
        );
        const ownedCustomSimpleBlasts = [];
        const ownedCustomCompositeBlasts = [];
        for (let key of Object.keys(allCustomSimpleBlasts))
            if (actorConfig.simple.indexOf(key) > -1) ownedCustomSimpleBlasts.push(allCustomSimpleBlasts[key]);
        for (let key of Object.keys(allCustomCompositeBlasts))
            if (actorConfig.composite.indexOf(key) > -1) ownedCustomCompositeBlasts.push(allCustomCompositeBlasts[key]);

        // Set owned form infusions
        let allFormInfusions = formInfusions;
        let ownedFormInfusions = [];
        for (let key of Object.keys(allFormInfusions)) {
            if (actorConfig.form.indexOf(key) > -1) ownedFormInfusions.push(allFormInfusions[key]);
        }

        // Set owned custom form infusions
        const allCustomFormInfusions = game.settings.get(ns, 'customFormInfusions') ?? {};
        const ownedCustomFormInfusions = [];
        for (let key of Object.keys(allCustomFormInfusions)) {
            if (actorConfig.form.indexOf(key) > -1) ownedCustomFormInfusions.push(allCustomFormInfusions[key]);
        }

        // Set owned substance infusions
        let allSubstanceInfusions = substanceInfusions;
        let ownedSubstanceInfusions = [];
        for (let key of Object.keys(allSubstanceInfusions)) {
            if (actorConfig.substance.indexOf(key) > -1) ownedSubstanceInfusions.push(allSubstanceInfusions[key]);
        }

        // Set owned custom substance infusions
        const allCustomSubstanceInfusions = game.settings.get(ns, 'customSubstanceInfusions') ?? {};
        const ownedCustomSubstanceInfusions = [];
        for (let key of Object.keys(allCustomSubstanceInfusions)) {
            if (actorConfig.substance.indexOf(key) > -1)
                ownedCustomSubstanceInfusions.push(allCustomSubstanceInfusions[key]);
        }

        // Set owned custom metakinesis
        const allCustomMetakinesis = game.settings.get(ns, 'customMetakinesis') ?? {};
        let ownedCustomMetakinesis = [];
        for (let key of Object.keys(allCustomMetakinesis)) {
            if (actorConfig.metakinesis.indexOf(key) > -1) ownedCustomMetakinesis.push(allCustomMetakinesis[key]);
        }

        // Set metakinesis as active if remember is on
        let activeMetakinesis = metakinesis;
        if (this.actor.getFlag(ns, 'remember-meta')) {
            const activeMetaIDs = this.actor.getFlag(ns, 'remember-meta-value');
            activeMetakinesis = Object.values(activeMetakinesis).map((t) => ({
                ...t,
                active: activeMetaIDs.includes(t.id) ? 'checked' : '',
            }));
            ownedCustomMetakinesis = Object.values(ownedCustomMetakinesis).map((t) => ({
                ...t,
                active: activeMetaIDs.includes(t.id) ? 'checked' : '',
            }));
        }

        // Set owned utility talents
        const allUtilityTalents = utilityTalents;
        let ownedUtilityTalents = [];
        for (let key of Object.keys(allUtilityTalents)) {
            if (actorConfig.utility.indexOf(key) > -1) ownedUtilityTalents.push(allUtilityTalents[key]);
        }

        // Set owned custom utility talents
        const allCustomUtilityTalents = game.settings.get(ns, 'customUtilityTalents') ?? {};
        let ownedCustomUtilityTalents = [];
        for (let key of Object.keys(allCustomUtilityTalents)) {
            if (actorConfig.utility.indexOf(key) > -1) ownedCustomUtilityTalents.push(allCustomUtilityTalents[key]);
        }

        if (this.actor.getFlag(ns, 'remember-utility')) {
            const activeUtilityIDs = this.actor.getFlag(ns, 'remember-utility-value');
            ownedUtilityTalents = ownedUtilityTalents.map((t) => ({
                ...t,
                active: activeUtilityIDs.includes(t.id) ? 'checked' : '',
            }));
            ownedCustomUtilityTalents = ownedCustomUtilityTalents.map((t) => ({
                ...t,
                active: activeUtilityIDs.includes(t.id) ? 'checked' : '',
            }));
        }

        // Set owned custom feats
        const allCustomFeats = game.settings.get(ns, 'customFeats') ?? {};
        const ownedCustomFeats = [];
        for (let key of Object.keys(allCustomFeats)) {
            if (actorConfig.feats.indexOf(key) > -1) ownedCustomFeats.push(allCustomFeats[key]);
        }

        // Set owned feats
        const playerFeats = this.actor.items.filter(
            (item) => item.system?.tag?.startsWith('feat_') || item.system?.tag?.startsWith('classFeat_'),
        );
        const ownedFeats = [];
        const featIDs = Object.keys({ ...feats, ...mythicFeats }).map((k) => k.replace(/^(feat_|classFeat_)/, ''));
        const customFeatIDs = Object.keys(allCustomFeats).map((k) => k.replace(/^(feat_|classFeat_)/, ''));
        const allFeatIDs = [...featIDs, ...customFeatIDs];
        for (let key of Object.keys(playerFeats)) {
            const feat = {
                name: playerFeats[key].name,
                id: playerFeats[key].system.tag.slice(5),
            };
            // Only show feats that have an interaction with the module either vanilla or modded
            if (allFeatIDs.includes(playerFeats[key].system.tag.replace(/^(feat_|classFeat_)/, '')))
                ownedFeats.push(feat);
        }

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
        const gatherBurn = this.kineticist.getGatherPowerReductions(); // TODO: have this take into account toggled feats if it doesn't already.
        const gather = {};
        for (let key in gatherTemplate) {
            if (gatherBurn[key] > 0) gather[key] = { ...gatherTemplate[key], burn: gatherBurn[key] };
        }

        return foundry.utils.mergeObject(super.getData(), {
            actor: this.actor,
            simple: ownedSimpleBlasts,
            composite: getCompositeBlasts(ownedSimpleBlasts, true),
            formInfusions: ownedFormInfusions,
            substanceInfusions: ownedSubstanceInfusions,
            utilityTalents: ownedUtilityTalents,
            feats: ownedFeats,
            metakinesis: activeMetakinesis,
            customSimple: ownedCustomSimpleBlasts,
            customComposite: ownedCustomCompositeBlasts,
            customFormInfusions: ownedCustomFormInfusions,
            customSubstanceInfusions: ownedCustomSubstanceInfusions,
            customUtilityTalents: ownedCustomUtilityTalents,
            customMetakinesis: ownedCustomMetakinesis,
            customFeats: ownedCustomFeats,
            infusionSpecialization: this.kineticist.getInfusionSpecialization(),
            flags: flags, // TODO: use flags instead of the variables below
            gather: Object.values(gather),
            burn: this.kineticist.getBurn(),
            compositeSpecializationActive: this.actor.classes.kineticist.level >= 16,
            actorFlags: this.actor.flags[ns],
            // TODO: just move these to some onload or something or figure out handlebar/conditionals better
        });
    }

    /**
     * Returns a PF1.Item that uses the default PF1 action for its only action.  All fields are default.
     * @returns {Promise<*>}
     */
    async getBaseBlast() {
        return (await this.actor.createEmbeddedDocuments('Item', [getBaseData()], { temporary: true }))[0];
    }

    async _asyncUpdateObject(event, inputFormData) {
        // Parse form data first
        const formData = Object.fromEntries(Object.entries(inputFormData).filter(([key, value]) => value !== null));

        const customFormInfusions = game.settings.get(ns, 'customFormInfusions');
        const customSubstanceInfusions = game.settings.get(ns, 'customSubstanceInfusions');
        const customUtilityTalents = game.settings.get(ns, 'customUtilityTalents');
        const customMetakinesis = game.settings.get(ns, 'customMetakinesis');
        const customBlasts = game.settings.get(ns, 'customBlasts');

        // Fetch infusions
        let formInfusion;
        if (formData.form.startsWith('custom')) {
            formInfusion = customFormInfusions[formData.form.slice(7)];
            if (formInfusion) formInfusion.transform = parseTransform(formInfusion.transform);
        } else {
            formInfusion = formInfusions[formData.form];
            if (formInfusion) formInfusion.transform = formTransforms[formData.form];
        }

        let substanceInfusion;
        if (formData.form.startsWith('custom')) {
            substanceInfusion = customSubstanceInfusions[formData.substance.slice(7)];
            if (substanceInfusion) substanceInfusion.transform = parseTransform(substanceInfusion.transform);
        } else {
            substanceInfusion = substanceInfusions[formData.substance];
            if (substanceInfusion) substanceInfusion.transform = substanceTransforms[formData.substance];
        }

        // Get applied utility talents
        const appliedUtilityTalents = [];
        const utilityKeys = Object.keys(formData).filter((k) => k.includes('utility-'));
        const allCustomUtilityTalents = game.settings.get(ns, 'customUtilityTalents') ?? {};
        for (let k of utilityKeys) {
            const talent = utilityTalents[formData[k]] ?? allCustomUtilityTalents[formData[k]];
            if (talent) appliedUtilityTalents.push(talent);
        }

        // Get applied metakinesis
        const appliedMetakinesis = [];
        const metakinesisKeys = Object.keys(formData).filter((k) => k.includes('meta-'));
        const allCustomMetakinesis = game.settings.get(ns, 'customMetakinesis') ?? {};
        for (let k of metakinesisKeys) {
            const talent = metakinesis[formData[k]] ?? allCustomMetakinesis[formData[k]];
            if (talent) appliedMetakinesis.push(talent);
        }

        // Fetch (or create) template item to copy and morph
        let blastItem = await this.getBaseBlast();
        console.log('Foundry VTT | blastItem', blastItem);

        // Get blast config from module config
        let blastConfig = simpleBlastsWith3pp[formData['blast']];
        if (!blastConfig) blastConfig = compositeBlastsWith3pp[formData['blast']];
        console.log('Foundry VTT | blastConfig', blastConfig);

        // Get blast data
        if (blastItem === undefined) {
            console.error('PF1 Kineticist Enhancements | Blast Item not found', blastItem);
            ui.notifications.error('PF1 Kineticist Enhancements | Blast Item not found');
            return;
        }
        let blastData = blastItem.toObject();

        console.log('Foundry VTT | Start of blastData mutation', blastData);
        // Merge template item with blast config data
        blastData = foundry.utils.mergeObject(blastData, getBaseData());

        // Merge template item with data based on form input
        blastData = foundry.utils.mergeObject(blastData, {
            img: blastConfig.icon,
            system: {
                identifiedName: blastConfig.name,
                attackNotes: [],
            },
        });
        //blastData.system.identifiedName = blastConfig.name;
        // Create empty attack notes in case it doesn't exist
        //blastData.system.attackNotes = [];

        // Base simple blast
        let BASE = ['(ceil(@classes.kineticist.level / 2))d6', 'Simple'];
        // Elemental Overflow
        let EO = [
            '(min(@resources.classFeat_burn.value, floor(@classes.kineticist.level / 3)) * 2)',
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
        if (formInfusion?.transform) {
            const transform = parseTransform(formInfusion.transform);
            [dmgParts, blastData] = transform(this, dmgParts, blastData, blastConfig, formData);
            if (blastData.system.actions[0].actionType === 'save')
                blastData.system.effectNotes.push(`${formInfusion.name} Infusion`);
            else blastData.system.attackNotes.push(`${formInfusion.name} Infusion`);
        }
        if (substanceInfusion?.transform) {
            const transform = parseTransform(substanceInfusion.transform);
            [dmgParts, blastData] = transform(this, dmgParts, blastData, blastConfig, formData);
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

        // START OF TRANSFORMS

        // Apply utility talents
        appliedUtilityTalents.map((talent) => {
            const transform = utilityTransforms[talent.id] ?? parseTransform(customUtilityTalents[talent.id].transform);
            if (transform) [dmgParts, blastData] = transform(this, dmgParts, blastData, blastConfig, formData);
        });

        // Apply metakinesis
        appliedMetakinesis.map((talent) => {
            const transform = metaTransforms[talent.id] ?? parseTransform(customMetakinesis[talent.id].transform);
            if (transform) [dmgParts, blastData] = transform(this, dmgParts, blastData, blastConfig, formData);
        });

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

        // END OF TRANSFORMS
        console.log('Final dmgParts', dmgParts);

        // Build damage string
        let damage = '';
        if (blastData.flags.baseDamageModified) {
            for (let p of dmgParts) damage += ` + ${p[0]}[${p[1]}]`;
        } else {
            damage = `${dmgParts[0][0]}[${dmgParts[0][1]}]`;
            for (let p of dmgParts.slice(1)) {
                if (p[1].includes('Physical ')) damage += ` + (${p[0]})[${p[1]}]`;
                else damage += ` + (${p[0]})[${p[1]}]`;
            }
        }
        // TODO: Find where I should add the full name of the infusion to the attack nodes as 'X Infusion'

        // Set damage string
        blastData.system.actions[0].damage.parts[0] = {
            formula: damage,
            type: { values: blastConfig.damageType },
        };

        console.log('Damage', blastData.system.actions[0].damage);

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
            for (let talent of appliedMetakinesis) activeMetaIDs.push(talent.id);
            this.actor.setFlag(ns, 'remember-meta-value', activeMetaIDs);
        }

        this.actor.setFlag(ns, 'remember-utility', formData['remember-utility']);
        if (formData['remember-utility']) {
            const activeUtilityIDs = [];
            for (let talent of appliedUtilityTalents) activeUtilityIDs.push(talent.id);
            this.actor.setFlag(ns, 'remember-utility-value', activeUtilityIDs);
        }

        this.actor.setFlag(ns, 'remember-apply-burn', formData['apply-burn']);
        this.actor.setFlag(ns, 'remember-skip-templates', formData['skip-templates']);
        this.actor.setFlag(ns, 'remember-double-damage', formData['double-damage']);
        this.actor.setFlag(ns, 'remember-double-area', formData['double-area']);
        this.actor.setFlag(ns, 'remember-attack-fix', formData['attack-fix']);

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
