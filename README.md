# pf1-kineticist-enhancements

Add your description here.

## Installation

Add your installation instructions here.

## Development

- Clone the repository
- Switch to `alpha` branch
- Run `yarn install` (if you don't have yarn, run `npm install -g yarn` (may require admin/root))
- To build:
  - Run `yarn build`
- To develop:
  - Create a folder named `dist` in the project root.
  - Create a symlink/shortcut from the `dist` folder to your foundry's module directory and name the linked folder `pf1-kineticist-enhancements`
    - Windows default: `%LocalAppData%\FoundryVTT\Data\modules`
    - Linux default: `~/.local/share/FoundryVTT/Data/modules`
  - Run `yarn watch` (this will watch the src directory for changes and automatically rebuild changes live)
  - Launch Foundry

### Prerequisites

In order to build this module, recent versions of `node` and `yarn/npm` are
required. If you don't have `yarn`, but have `npm`, just run `npm install -g yarn` to install `yarn`.

### Linking the built project to Foundry VTT

In order to provide a fluent development experience, it is recommended to link
the built module to your local Foundry VTT installation's data folder. In
order to do so, first add a file called `foundryconfig.json` to the project root
with the following content:

```
{
  "dataPath": "/absolute/path/to/your/FoundryVTT/Data"
}
```

(if you are using Windows, make sure to use `\` as a path separator instead of
`/`)

Then run

```
npm run link-project
```

On Windows, creating symlinks requires administrator privileges so unfortunately
you need to run the above command in an administrator terminal for it to work.

### Running the tests

You can run the tests with the following command:

```
npm test
```
