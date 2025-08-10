import { ns } from '../lib/config';
import { getCompositeBlasts } from '../lib/common';
import { simpleBlastsAsArray, simpleBlastsWith3pp } from '../lib/generated/simpleBlasts';
import { compositeBlastsWith3pp } from '../lib/generated/compositeBlasts';
import { formInfusions } from '../lib/generated/formInfusions';
import { substanceInfusions } from '../lib/generated/substanceInfusions';
import { metakinesis } from '../lib/generated/metakinesis';
import { bundledUtilityTalents, utilityTalents } from '../lib/generated/utilityTalents';
import { Kineticist } from './Kineticist';
import { feats, mythicFeats } from '../lib/blastData/feats';
import BlastFactory from '../lib/factory';

export class ApplicationBlastAttack extends FormApplication {
    constructor(options = {}) {
        super(options);
        this.actor = options.actor;
        this.kineticist = new Kineticist(this.actor);
    }

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

        // Set owned bundled utility talents
        const allBundledUtilityTalents = bundledUtilityTalents;
        let ownedBundledUtilityTalents = [];
        for (let key of Object.keys(allBundledUtilityTalents)) {
            if (actorConfig.utility.indexOf(key) > -1) ownedBundledUtilityTalents.push(allBundledUtilityTalents[key]);
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
        let ownedCustomFeats = [];
        for (let key of Object.keys(allCustomFeats)) {
            // custom feats are keyed by id; flags store ids as well
            if (actorConfig.feats.indexOf(key) > -1) ownedCustomFeats.push(allCustomFeats[key]);
        }

        // Set owned feats (merge from actor items and saved actor flags)
        const playerFeats = (this.actor.items ?? []).filter(
            (item) =>
                (item.system?.tag &&
                    (item.system.tag.startsWith('feat_') || item.system.tag.startsWith('classFeat_'))) ||
                item.system?.type === 'feat',
        );
        const normalize = (t) => (t + '').replace(/^(feat_|classFeat_)/, '');
        const itemOwnedIds = new Set(
            playerFeats
                .map((it) => it?.system?.tag)
                .filter((t) => typeof t === 'string' && t.length > 0)
                .map((t) => normalize(t)),
        );
        const configOwnedIds = new Set(
            [...(actorConfig?.feats ?? []), ...(actorConfig?.mythicFeats ?? [])].map((t) => normalize(t)),
        );

        // Build owned feats from core feat data (includes mythic feats)
        const allCoreFeats = { ...feats, ...mythicFeats };
        const ownedFeats = [];
        const pushed = new Set();
        for (let key of Object.keys(allCoreFeats)) {
            const f = allCoreFeats[key];
            const id = normalize(f?.id ?? key);
            if (itemOwnedIds.has(id) || configOwnedIds.has(id)) {
                if (!pushed.has(id)) {
                    ownedFeats.push(f);
                    pushed.add(id);
                }
            }
        }

        // Apply remembered selections to feats and custom feats (reuse utility remember flag/value)
        if (this.actor.getFlag(ns, 'remember-utility')) {
            const activeUtilityIDs = this.actor.getFlag(ns, 'remember-utility-value') ?? [];
            // For feats, template values are prefixed; mirror that here for comparison
            for (let i = 0; i < ownedFeats.length; i++) {
                const t = ownedFeats[i];
                ownedFeats[i] = { ...t, active: activeUtilityIDs.includes(`feat_${t.id}`) ? 'checked' : '' };
            }
            for (let i = 0; i < ownedCustomFeats.length; i++) {
                const t = ownedCustomFeats[i];
                ownedCustomFeats[i] = {
                    ...t,
                    active: activeUtilityIDs.includes(`custom-feat_${t.id}`) ? 'checked' : '',
                };
            }
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
            bundledUtilityTalents: ownedBundledUtilityTalents,
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

    async _asyncUpdateObject(event, inputFormData) {
        // Parse form data first
        const formData = Object.fromEntries(Object.entries(inputFormData).filter(([key, value]) => value !== null));
        const acme = new BlastFactory({ formData, actor: this.actor });
        await acme.runFactory();
        const newBlast = await acme.getDocument();

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
            for (let talent of acme.metakinesis) activeMetaIDs.push(talent.id);
            this.actor.setFlag(ns, 'remember-meta-value', activeMetaIDs);
        }

        this.actor.setFlag(ns, 'remember-utility', formData['remember-utility']);
        if (formData['remember-utility']) {
            const activeUtilityIDs = [];
            // Utilities
            for (let talent of acme.utilityTalents) activeUtilityIDs.push(talent.id);
            // Feats (core and custom) — collect from form data values
            for (const [k, v] of Object.entries(formData)) {
                if (k.startsWith('feat-') || k.startsWith('custom-feat-')) activeUtilityIDs.push(v);
            }
            // Deduplicate
            const unique = [...new Set(activeUtilityIDs)];
            this.actor.setFlag(ns, 'remember-utility-value', unique);
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
            console.log('pf1-ke | Final Blast Item:', newBlast);
            await newBlast.use({ skipDialog: false });
            if (formData['apply-burn']) await this.kineticist.addBurn(formData['burn']);
        } catch (err) {
            console.error('pf1-ke | Error using new item', err);
        }
    }

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
