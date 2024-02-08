# 1.1

## Breaking changes

The Kineticist class has been changed within the PF1 system module.  Calculations will break unless the identifier for the class features on your page are fixed.  This means either appending the prefix `classFeat_` to all the features, and all references, or delete and readd the Kineticist class from your sheet on the Features tab.  (Be sure to note how much health you have, then when readding the class, re-add as RAW and you can manually set its level back to previous, along with your health.)

## Changes
- Removed hidden dependency on Token Action HUD PF1 module
- New attack card is much more feature rich and automatically updates values.
- Fixed several issues related to displaying damage
- Ability to automaticlaly apply burn
- Added ability to automatically support certain Kineticist related features/feats as long as they follow the naming convention for their identifier
  - feat: `feat_camelCase` (Be wary of exceptions in the compendium, such as `feat_twoweaponFighting`)
  - class feature: `classFeat_camelCase`
- Added support for the following class features:
  - Infusion Specialization
  - Supercharge
  - Composite specialization
  - Utility Talents:
    - Flash step
  - Metakinesis:
    - Twice
    - Quicken
- Added support for the following feats:
  - Kinetic Acceleration
  - Accelerated Gathering
  - Mythic Supercharge
  - Mythic Gather Power
  - Mythic Haste/Mythic Celerity



# 1.0.1 - The official Release

Marks the official release of the module on Foundry's repository
