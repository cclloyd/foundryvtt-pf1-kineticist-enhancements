# Kineticist Enhancements for Pathfinder 1st Edition

This is a module for FoundryVTT that streamlines using the Kinetic Blast class feature of the Kineticist class in Pathfinder 1.

# Features:
-
- Automatiaclly apply burn
- Automatically detect feats/class features on your sheet
  - Requires the identifier to follow a specific standard
    - feat: `feat_camelCase` (Be wary of exceptions in the compendium, such as `feat_twoweaponFighting`)
    - class feature: `classFeat_camelCase`
- Support for various feats/class features right out of the box (more on request, just open an issue!)
-


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
