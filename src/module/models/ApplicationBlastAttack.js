import { defaultBlasts, ns } from '../lib/config';
import { defaultCompositeTransform, getCompositeBlasts, getSimpleBlasts } from '../lib/common';
import { compositeEnergy, compositePhysical, simpleEnergy, simplePhysical } from '../lib/blastData/simple';
import { metaActions } from '../lib/blastData/metaActions';
import { formInfusions } from '../lib/blastData/formInfusionConfig';
import { wildTalents } from '../lib/blastData/wildTalents';

export class ApplicationBlastAttack extends FormApplication {
    constructor(options = {}) {
        super(options);
        this.actor = options.actor;
        //if (options.actor) {}
    }

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
            width: 400,
            height: 500,
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
        const simple = getSimpleBlasts();
        return foundry.utils.mergeObject(super.getData(), {
            simple: simple,
            composite: getCompositeBlasts(simple),
            actor: this.actor,
        });
    }

    async getOrCreateManagedBlast() {
        const managedID = this.actor.getFlag(ns, 'managedBlast');
        if (managedID === undefined) {
            const oldItems = this.actor.items.filter((o) => o.data.name === 'KE Managed Blast');
            const oldIDs = [];
            for (let i of oldItems) oldIDs.push(i.data._id);
            await this.actor.deleteEmbeddedDocuments('Item', oldIDs);
            const newItem = (await this.actor.createEmbeddedDocuments('Item', [simplePhysical]))[0];
            this.actor.setFlag(ns, 'managedBlast', newItem.data._id);
            return newItem;
        } else {
            let blastItem = this.actor.items.filter((o) => o.data._id === managedID)[0];
            if (blastItem) {
                return blastItem;
            } else {
                const oldItems = this.actor.items.filter((o) => o.data.name === 'KE Managed Blast');
                const oldIDs = [];
                for (let i of oldItems) oldIDs.push(i.data._id);
                await this.actor.deleteEmbeddedDocuments('Item', oldIDs);
                const newItem = (await this.actor.createEmbeddedDocuments('Item', [simplePhysical]))[0];
                this.actor.setFlag(ns, 'managedBlast', newItem.data._id);
                return newItem;
            }
        }
    }

    async _asyncUpdateObject(event, formData) {
        /*
        for (let item of this.actor.items) {
            item.unsetFlag(ns, 'managedBlast');
        }
        this.actor.unsetFlag(ns, 'managedBlast');

         */
        let blastItem = await this.getOrCreateManagedBlast(formData['blast']);
        // Get blast config from module config
        let blastConfig = defaultBlasts.filter((o) => o.id === formData['blast'])[0];
        console.log('blastConfig', blastConfig);

        let blastData = blastItem.toObject();
        console.log('Start of blastData mutation', blastData);
        let baseBlast;
        if (blastConfig.class === 'simple') {
            if (blastConfig.type === 'energy') baseBlast = simpleEnergy;
            else baseBlast = simplePhysical;
        } else {
            if (blastConfig.type === 'energy') baseBlast = compositeEnergy;
            else baseBlast = compositePhysical;
        }
        console.log('baseBlast', baseBlast);

        // Merge template item with blast config data
        blastData = foundry.utils.mergeObject(blastData, baseBlast);
        // Merge template item with data based on form input
        blastData = foundry.utils.mergeObject(blastData, {
            name: `${blastConfig.name}`,
            img: blastConfig.icon,
        });

        blastData.data.attackNotes = [];

        // TODO: Create pipeline of functions that accept blastData, formData as input and output modified blastData
        // Base simple blast
        let BASE = ['ceil(@classes.kineticist.level /2)d6', 'Simple'];
        // Elemental Overflow
        let EO = ['(min(@resources.burn.value, floor(@classes.kineticist.level /3))*2)', 'Elemental Overflow'];
        // Physical blast bonus
        let PB = ['@classes.kineticist.level', 'Physical blast'];
        // Array of damage parts in the form of [str:damage string, str:description]
        let dmgParts = [BASE];

        // Add physical bonus
        if (blastConfig.type === 'physical') {
            dmgParts.push(PB);
            blastData.data.attackNotes.push(`Not Touch Attack`);
        } else {
            blastData.data.attackNotes.push(`Touch Attack`);
        }

        // Add elemental overflows
        dmgParts.push(EO);

        // Apply custom transform function if found (mainly used for special composite blasts)
        if (blastConfig.transform) {
            [dmgParts, blastData] = blastConfig.transform(dmgParts, blastData, blastConfig, formData);
        } else if (blastConfig.class === 'composite') {
            [dmgParts, blastData] = defaultCompositeTransform(dmgParts, blastData, blastConfig, formData);
        }

        // Get form infusion from form
        let formInfusionId = null;
        for (let key of Object.keys(formData)) {
            if (key.startsWith('form-') && formData[key] === true) {
                formInfusionId = key.slice(5);
                break;
            }
        }

        // Run form infusion transformation
        let formInfusion;
        if (formInfusionId) {
            formInfusion = formInfusions[formInfusionId];
            [dmgParts, blastData] = formInfusion.transform(this, dmgParts, blastData, blastConfig, formData);
        }

        // Apply changes to name
        // TODO: Add substance infusion name mutations
        if (formInfusion) {
            if (formInfusion.prepend) blastData.name = `${formInfusion.prependText} ${blastData.name}`;
            if (formInfusion.append) blastData.name = `${blastData.name} ${formInfusion.appendText}`;
            if (!formInfusion.noBlastText) blastData.name += ' Blast';
        }
        if (!formInfusion) {
            blastData.name += ' Blast';
        }

        // Apply metakinesis
        for (let key of Object.keys(formData)) {
            // If the key starts with meta and the key is checked
            if (key.startsWith('meta-') && formData[key] === true) {
                // Run blastData through the meta action
                [dmgParts, blastData] = metaActions[key.slice(5)](this, dmgParts, blastData, blastConfig, formData);
            }
        }

        // Apply wild talents
        let talentIDs = this.actor.getFlag(ns, 'wildTalents');
        for (let talentId of talentIDs) {
            let t = wildTalents[talentId];
            if (t.transformBlast) t.transformBlast(dmgParts, blastData, blastConfig, formData);
        }

        // Build damage string
        let damage = `${dmgParts[0][0]}`;
        if (dmgParts.length > 1) {
            for (let p of dmgParts.slice(1)) {
                damage += ` + ${p[0]}[${p[1]}]`;
            }
        }

        // Set damage string
        blastData.data.damage.parts[0] = [damage, blastConfig.damageName];

        console.log('End of blastData mutation', blastData);

        // Create new item from data
        const newBlast = (await this.actor.createEmbeddedDocuments('Item', [blastData]))[0];
        console.log('newBlast', newBlast);

        // Pull up the dialog to use the blast
        try {
            await newBlast.use({ skipDialog: false });
        } catch (err) {
            //console.log('error rolling', err);
        }
        // Delete item after used
        console.log('Deleting item...', newBlast.data._id);
        try {
            await this.actor.deleteEmbeddedDocuments('Item', [newBlast.data._id]);
            console.log('Deleted item');
        } catch (err) {
            console.log('Error deleting item', err);
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
