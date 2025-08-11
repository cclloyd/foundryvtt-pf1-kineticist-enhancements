import { ns } from "./config.js";
import { SettingsCustomUtilities } from "../applications/SettingsCustomUtilities";
// import { SettingsCustomInfusions } from "./applications/SettingsCustomInfusions";
// import { SettingsCustomUtilities } from "./applications/SettingsCustomUtilities";
// import { SettingsCustomMetakinesis } from "./applications/SettingsCustomMetakinesis";
// import { SettingsCustomBlasts } from "./applications/SettingsCustomBlasts";
// import { SettingsCustomFeats } from "./applications/SettingsCustomFeats";

export function registerSettings() {
    // Register any custom module settings here
    // game.settings.registerMenu(ns, "customFormInfusionsMenu", {
    //     label: "Custom Infusions",
    //     name: "Configure Infusions",
    //     type: SettingsCustomInfusions
    // });
    game.settings!.registerMenu(ns, "customUtilityTalentsMenu", {
        label: "Custom Utility Talents",
        name: "Configure Utility Talents",
        type: SettingsCustomUtilities,
        hint: "",
        icon: "",
        restricted: false,
    });
    // game.settings.registerMenu(ns, "customMetakinesisMenu", {
    //     label: "Custom Metakinesis",
    //     name: "Configure Metakinesis",
    //     type: SettingsCustomMetakinesis
    // });
    // game.settings.registerMenu(ns, "customBlastsMenu", {
    //     label: "Custom Blasts",
    //     name: "Configure Blasts",
    //     type: SettingsCustomBlasts
    // });
    // game.settings.registerMenu(ns, "customFeatsMenu", {
    //     label: "Feats",
    //     name: "Configure Feats",
    //     type: SettingsCustomFeats
    // });
    //
    // game.settings.register(ns, "customFormInfusions", {
    //     scope: "world",
    //     config: false,
    //     type: Object,
    //     default: {}
    // });
    //
    // game.settings.register(ns, "customSubstanceInfusions", {
    //     scope: "world",
    //     config: false,
    //     type: Object,
    //     default: {}
    // });
    //
    // game.settings.register(ns, "customMetakinesis", {
    //     scope: "world",
    //     config: false,
    //     type: Object,
    //     default: {}
    // });
    //
    // game.settings.register(ns, "customUtilityTalents", {
    //     scope: "world",
    //     config: false,
    //     type: Object,
    //     default: {}
    // });
    //
    // game.settings.register(ns, "customBlasts", {
    //     scope: "world",
    //     config: false,
    //     type: Object,
    //     default: {}
    // });
    //
    // game.settings.register(ns, "customFeats", {
    //     scope: "world",
    //     config: false,
    //     type: Object,
    //     default: {}
    // });
}
