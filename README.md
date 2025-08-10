# Kineticist Enhancements for Pathfinder 1st Edition

This is a module for FoundryVTT that streamlines using the Kinetic Blast class feature of the Kineticist class in Pathfinder 1.

# Features:
-
- Automatically apply burn
- Automatically detect feats/class features on your sheet
  - Requires the identifier to follow a specific standard
    - feat: `feat_camelCase` (Be wary of exceptions in the compendium, such as `feat_twoweaponFighting`)
    - class feature: `classFeat_camelCase`
- Support for various feats/class features right out of the box (more on request, just open an issue!)
- !NEW! Custom infusions/blasts/feats.  See usage for more info.


# Screenshots

- HUD for selected Kineticist token
  - ![HUD Screenshot](docs/screenshots/hud.png?raw=true 'HUD screenshot')
- Infusions Config
  - ![Infusions Config Screenshot](docs/screenshots/infusions.png?raw=true 'HUD screenshot')
- Attack Screen
  - ![Attack Screenshot](docs/screenshots/blastattack.png?raw=true 'Attack screenshot')
- Chat Card:
  - ![Chat Card Screenshot](docs/screenshots/blastcard.png?raw=true 'Chat Card screenshot')

# Installation

Install through the FoundryVTT admin interface.

Manifest URL:
- **Latest:** https://gitlab.com/api/v4/projects/29080072/packages/generic/permalink/latest/module.json
- **Specific Version:** https://gitlab.com/api/v4/projects/29080072/packages/generic/permalink/v1.x.x/module.json

# Usage

## Getting Started
- Select the kineticist's token, a menu should appear in the top left with 1 or 2 buttons.
- Select 'KE Config' to bring up the actor config menu.  From here you can check off all the blasts/infusions/etc you have so that they will appear in the attack menu.
- Hit save to confirm your changes.
- Unselect then reselect your token.  A new attack button should appear next to the config button.
- Using this menu you can build your attack then fire it off.  It provides some guides to help you manage resources.

## Custom Abilities

There is support for adding custom blasts, infusions, utility talents, metakinesis, and feats.

To add a custom item:

- Go to settings > Configure Settings > Kineticist Enhancements for pf1e
- Choose which custom item to add
- From this edit menu, you can set all the parameters for that particular wild talent.  Note that not everything has an actual effect, but can be there for visual/sorting purposes, and may gain support in the future.
- The important bits are
  - Name: visual name
  - ID: internal ID, must be unique
  - Prefix/Suffix/Name Override: used to alter the name to make it make sense grammatically
  - Transform: This is where the magic happens.  It takes the listed parameters, runs your transformations, and outputs the updated data object and damage.   You can look at the `formTransforms.js` to see examples, or below.
    - Parameters:
      - `instance`: the `ApplicationBlastAttack` instance
      - `dmgParts`: Array of tuples of [damage value, damage description] as per how pf1 handles it
      - `blastData`: The javascript object of the pf1.Item.  Most edits to the attack will be in `blastData.system.actions[0]`
      - `blastConfig`: static config object of the blast being fired.  Can possibly be a custom blast config, otherwise found in `src/lib/generated/`
      - `formData`: the form data object from the `ApplicationBlastAttack`.  Contains the results of your choices in the form.
    - Returns:
      - `blastData`: The modified object
      - `dmgParts`: The modified damage
    - Example: This alters the damage, and sets it to a 10ft radius circle, and adds a reflex save. For more examples see `src/lib/blastData/`
      ```javascript
      blastData.system.actions[0].actionType = 'save';
      blastData.system.actions[0].range.value = '0';
      blastData.system.actions[0].measureTemplate = {
          color: '',
          customColor: '',
          customTexture: '',
          overrideColor: false,
          overrideTexture: false,
          size: 10,
          texture: '',
          type: 'circle',
      };
      blastData.system.actions[0].save = {
          dc: '10 + @classes.kineticist.level + @abilities.con.mod', // Default save for blasts
          description: `Reflex half`,
          type: 'ref',
      };
      dmgParts[0][0] = `min(5, ceil(@classes.kineticist.level /2))d6`;
      blastData.system.actions[0].ability.damageMult = 1;
      return [dmgParts, blastData];
      ```



# Development

- Clone the repository
- Run `yarn install`
- To build:
  - Run `yarn build`
- To develop:
  - Create a folder named `dist` in the project root.
  - Create a symlink/shortcut from the `dist` folder to your foundry's module directory and name the linked folder `pf1-kineticist-enhancements`
    - Windows default: `%LocalAppData%\FoundryVTT\Data\modules`
    - Linux default: `~/.local/share/FoundryVTT/Data/modules`
    - Recommended: develop in a docker container, mount the `dist` volume to the above destination
  - Run `yarn watch` (this will watch the src directory for changes and automatically rebuild changes live)
  - Launch Foundry

## Prerequisites

In order to build this module, recent versions of `node` (>= 16) and `yarn/npm` are
required. If you don't have `yarn`, but have `npm`, just run `npm install -g yarn` to install `yarn`.
