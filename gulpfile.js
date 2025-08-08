const { rollup, watch: rollupWatch } = require('rollup');
const argv = require('yargs').argv;
const chalk = require('chalk');
const fs = require('fs-extra');
const gulp = require('gulp');
const path = require('path');
const rollupConfig = require('./rollup.config');
const semver = require('semver');
const sass = require('gulp-dart-sass');

// Helper: format current local time as dev-YYYYMMDD-HHMMSS
function getDevTimestampVersion(date = new Date()) {
    const pad = (n) => String(n).padStart(2, '0');
    const year = date.getFullYear();
    const month = pad(date.getMonth() + 1);
    const day = pad(date.getDate());
    const hours = pad(date.getHours());
    const minutes = pad(date.getMinutes());
    const seconds = pad(date.getSeconds());
    return `dev-${year}${month}${day}-${hours}${minutes}${seconds}`;
}

async function writeStampedModuleJson(srcPath, destPath) {
    try {
        const json = await fs.readJSON(srcPath);
        json.version = getDevTimestampVersion();
        await fs.ensureDir(path.dirname(destPath));
        await fs.writeJSON(destPath, json, { spaces: 2 });
    } catch (err) {
        console.error(chalk.red(`[module.json] failed to stamp: ${err?.message || err}`));
        // Fallback to raw copy to avoid breaking build
        await fs.copy(srcPath, destPath);
    }
}

/********************/
/*  CONFIGURATION   */
/********************/

const baseName = path.basename(path.resolve('.'));
const sourceDirectory = './src';
const distDirectory = './dist';
const distDirectory2 = '/data/dev/heavy-rain/Data/modules/pf1-kineticist-enhancements';
const stylesDirectory = `${sourceDirectory}/styles`;
const stylesExtension = 'scss';
const sourceFileExtension = 'js';
const staticFiles = ['assets', 'fonts', 'lang', 'packs', 'templates', 'module.json'];
const getDownloadURL = (version) => `https://host/path/to/${version}.zip`;

/********************/
/*      BUILD       */
/********************/

/**
 * Build the distributable JavaScript code
 */
async function buildCode() {
    const build = await rollup({ input: rollupConfig.input, plugins: rollupConfig.plugins });
    return build.write(rollupConfig.output);
}

/**
 * Build style sheets
 */
function buildStyles() {
    return gulp
        .src(`${stylesDirectory}/${baseName}.${stylesExtension}`)
        .pipe(sass().on('error', sass.logError))
        .pipe(gulp.dest(`${distDirectory}/styles`));
}

/**
 * Copy static files
 */
async function copyFiles() {
    for (const file of staticFiles) {
        const srcPath = `${sourceDirectory}/${file}`;
        if (fs.existsSync(srcPath)) {
            if (file === 'module.json') {
                await fs.copy(srcPath, `${distDirectory}/${file}`);
                await fs.copy(srcPath, `${distDirectory2}/${file}`);
            } else {
                await fs.copy(srcPath, `${distDirectory}/${file}`);
                await fs.copy(srcPath, `${distDirectory2}/${file}`);
            }
        }
    }
}

/**
 * Watch for changes for each build step
 */
function buildWatch() {
    // Use Rollup's own watcher for incremental JavaScript rebuilds (significantly faster than full rebuilds)
    const rollupWatcher = rollupWatch({
        ...rollupConfig,
        watch: rollupConfig.watch || {},
    });

    rollupWatcher.on('event', (event) => {
        switch (event.code) {
            case 'BUNDLE_START':
                console.log(chalk.cyan('[rollup] build start...'));
                break;
            case 'BUNDLE_END':
                console.log(chalk.green(`[rollup] build finished in ${event.duration}ms`));
                break;
            case 'ERROR':
                console.error(chalk.red('[rollup] error'), event.error);
                break;
            case 'FATAL':
                console.error(chalk.red('[rollup] fatal error'), event.error);
                break;
        }
    });

    // Styles: recompile when any SCSS changes
    gulp.watch(`${stylesDirectory}/**/*.${stylesExtension}`, { ignoreInitial: false }, buildStyles);

    // Static files: copy only changed files instead of whole directories
    const staticGlobs = staticFiles.map((file) => {
        const full = path.join(sourceDirectory, file);
        try {
            const stat = fs.statSync(full);
            return stat.isDirectory() ? path.join(full, '**/*') : full;
        } catch (e) {
            return full; // fallback
        }
    });

    const watcher = gulp.watch(staticGlobs, { ignoreInitial: false });

    const copySingle = async (filePath) => {
        // preserve relative structure under src
        const rel = path.relative(sourceDirectory, filePath);
        if (!rel || rel.startsWith('..')) return;
        const dest1 = path.join(distDirectory, rel);
        const dest2 = path.join(distDirectory2, rel);
        await fs.ensureDir(path.dirname(dest1));
        await fs.ensureDir(path.dirname(dest2));
        if (rel === 'module.json') {
            await writeStampedModuleJson(filePath, dest1);
            await writeStampedModuleJson(filePath, dest2);
        } else {
            await fs.copy(filePath, dest1);
            await fs.copy(filePath, dest2);
        }
        console.log(chalk.gray(`[copy] ${rel}`));
    };

    const removeSingle = async (filePath) => {
        const rel = path.relative(sourceDirectory, filePath);
        if (!rel || rel.startsWith('..')) return;
        await fs.remove(path.join(distDirectory, rel));
        await fs.remove(path.join(distDirectory2, rel));
        console.log(chalk.gray(`[remove] ${rel}`));
    };

    watcher
        .on('add', copySingle)
        .on('change', copySingle)
        .on('unlink', removeSingle)
        .on('addDir', async (dirPath) => {
            const rel = path.relative(sourceDirectory, dirPath);
            await fs.ensureDir(path.join(distDirectory, rel));
            await fs.ensureDir(path.join(distDirectory2, rel));
        })
        .on('unlinkDir', async (dirPath) => {
            const rel = path.relative(sourceDirectory, dirPath);
            await fs.remove(path.join(distDirectory, rel));
            await fs.remove(path.join(distDirectory2, rel));
        });
}

/********************/
/*      CLEAN       */
/********************/

/**
 * Remove built files from `dist` folder while ignoring source files
 */
async function clean() {
    const files = [...staticFiles, 'module'];

    if (fs.existsSync(`${stylesDirectory}/${baseName}.${stylesExtension}`)) {
        files.push('styles');
    }

    console.log(' ', chalk.yellow('Files to clean:'));
    console.log('   ', chalk.blueBright(files.join('\n    ')));

    for (const filePath of files) {
        await fs.remove(`${distDirectory}/${filePath}`);
        await fs.remove(`${distDirectory2}/${filePath}`);
    }
}

/********************/
/*       LINK       */
/********************/

/**
 * Get the data path of Foundry VTT based on what is configured in `foundryconfig.json`
 */
function getDataPath() {
    const config = fs.readJSONSync('foundryconfig.json');

    if (config?.dataPath) {
        if (!fs.existsSync(path.resolve(config.dataPath))) {
            throw new Error('User Data path invalid, no Data directory found');
        }

        return path.resolve(config.dataPath);
    } else {
        throw new Error('No User Data path defined in foundryconfig.json');
    }
}

/**
 * Link build to User Data folder
 */
async function linkUserData() {
    let destinationDirectory;
    if (fs.existsSync(path.resolve(sourceDirectory, 'module.json'))) {
        destinationDirectory = 'modules';
    } else {
        throw new Error(`Could not find ${chalk.blueBright('module.json')}`);
    }

    const linkDirectory = path.resolve(getDataPath(), destinationDirectory, baseName);

    if (argv.clean || argv.c) {
        console.log(chalk.yellow(`Removing build in ${chalk.blueBright(linkDirectory)}.`));

        await fs.remove(linkDirectory);
    } else if (!fs.existsSync(linkDirectory)) {
        console.log(chalk.green(`Linking dist to ${chalk.blueBright(linkDirectory)}.`));
        await fs.ensureDir(path.resolve(linkDirectory, '..'));
        await fs.symlink(path.resolve(distDirectory), linkDirectory);
        await fs.symlink(path.resolve(distDirectory2), linkDirectory);
    }
}

/********************/
/*    VERSIONING    */
/********************/

/**
 * Get the contents of the manifest file as object.
 */
function getManifest() {
    const manifestPath = `${sourceDirectory}/module.json`;

    if (fs.existsSync(manifestPath)) {
        return {
            file: fs.readJSONSync(manifestPath),
            name: 'module.json',
        };
    }
}

/**
 * Get the target version based on on the current version and the argument passed as release.
 */
function getTargetVersion(currentVersion, release) {
    if (['major', 'premajor', 'minor', 'preminor', 'patch', 'prepatch', 'prerelease'].includes(release)) {
        return semver.inc(currentVersion, release);
    } else {
        return semver.valid(release);
    }
}

/**
 * Update version and download URL.
 */
function bumpVersion(cb) {
    const packageJson = fs.readJSONSync('package.json');
    const packageLockJson = fs.existsSync('package-lock.json') ? fs.readJSONSync('package-lock.json') : undefined;
    const manifest = getManifest();

    if (!manifest) cb(Error(chalk.red('Manifest JSON not found')));

    try {
        const release = argv.release || argv.r;

        const currentVersion = packageJson.version;

        if (!release) {
            return cb(Error('Missing release type'));
        }

        const targetVersion = getTargetVersion(currentVersion, release);

        if (!targetVersion) {
            return cb(new Error(chalk.red('Error: Incorrect version arguments')));
        }

        if (targetVersion === currentVersion) {
            return cb(new Error(chalk.red('Error: Target version is identical to current version')));
        }

        console.log(`Updating version number to '${targetVersion}'`);

        packageJson.version = targetVersion;
        fs.writeJSONSync('package.json', packageJson, { spaces: 2 });

        if (packageLockJson) {
            packageLockJson.version = targetVersion;
            fs.writeJSONSync('package-lock.json', packageLockJson, { spaces: 2 });
        }

        manifest.file.version = targetVersion;
        manifest.file.download = getDownloadURL(targetVersion);
        fs.writeJSONSync(`${sourceDirectory}/${manifest.name}`, manifest.file, { spaces: 2 });

        return cb();
    } catch (err) {
        cb(err);
    }
}

const execBuild = gulp.parallel(buildCode, buildStyles, copyFiles);

exports.build = gulp.series(clean, execBuild);
exports.watch = buildWatch;
exports.clean = clean;
exports.link = linkUserData;
exports.bumpVersion = bumpVersion;
