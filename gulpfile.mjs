// use single quotes
import { src, dest, series, parallel } from 'gulp';
import newer from 'gulp-newer';
import gulpSass from 'gulp-sass';
import sassCompiler from 'sass';
import * as esbuild from 'esbuild';

const sass = gulpSass(sassCompiler);

const isProd = process.env.NODE_ENV === 'production';

const paths = {
    entry: 'src/module/pf1-kineticist-enhancements.ts',
    styles: 'src/module/styles/**/*.scss',
    // add/remove extensions here as needed
    assets: 'src/**/*.{json,hbs,txt,md,png,jpg,jpeg,webp,svg,ogg,mp3,webm,wasm,csv,ttf,otf,woff,woff2}',
    out: 'dist',
    stylesOut: 'dist/module/styles',
    moduleOutFile: 'dist/module/pf1-kineticist-enhancements.js'
};

// --- TypeScript (esbuild) ---
async function buildTS() {
    await esbuild.build({
        entryPoints: [paths.entry],
        bundle: true,
        format: 'esm',
        target: 'es2020',
        platform: 'browser',
        sourcemap: true,
        minify: isProd,
        outfile: paths.moduleOutFile,
        logLevel: 'info'
    });
}

// esbuild’s own watcher for maximum speed (no extra chokidar cost)
async function watchTS(done) {
    const ctx = await esbuild.context({
        entryPoints: [paths.entry],
        bundle: true,
        format: 'esm',
        target: 'es2020',
        platform: 'browser',
        sourcemap: true,
        minify: false,
        outfile: paths.moduleOutFile,
        logLevel: 'info'
    });
    await ctx.watch();
    done();
}

// --- SCSS ---
function buildStyles() {
    return src(paths.styles, { base: 'src/styles' })
        .pipe(sass.sync({ outputStyle: isProd ? 'compressed' : 'expanded' }).on('error', sass.logError))
        .pipe(dest(paths.stylesOut));
}

async function watchStyles() {
    // Let gulp handle SCSS watching; fast enough & simple
    const chokidar = (await import('chokidar')).default;
    const watcher = chokidar.watch(paths.styles, { ignoreInitial: false });
    watcher.on('all', () => buildStyles());
}

// --- Assets (copy-as-is) ---
function copyAssets() {
    return src(paths.assets, { base: 'src' })
        .pipe(newer(paths.out))
        .pipe(dest(paths.out));
}

async function watchAssets() {
    const chokidar = (await import('chokidar')).default;
    const watcher = chokidar.watch(paths.assets, { ignoreInitial: false });
    watcher.on('all', () => copyAssets());
}

// --- Public tasks ---
export const build = series(buildTS, parallel(buildStyles, copyAssets));
export const dev = series(
    // keep initial full build, then start watchers
    series(buildTS, parallel(buildStyles, copyAssets)),
    parallel(watchTS, watchStyles, watchAssets)
);
