import { ns } from './config.js';

/**
 * Simple logger with prefix and level control.
 * Usage:
 *   import { keLogger as logger } from './lib/logger.js';
 *   logger.setPrefix('[pf1-ke]');
 *   logger.log('Hello (log)');
 *   logger.info('Hello (info)');
 *   const sub = logger.child('Actor');
 *   sub.debug('Loaded', actor.id);
 */
export class Logger {
    constructor({ prefix = '', level = 'info', enabled = true } = {}) {
        this._prefix = prefix || `[${ns}]`;
        this._enabled = enabled;
        this._levels = { debug: 10, log: 15, info: 20, warn: 30, error: 40, none: 1000 };
        this._level = this._levels[level] !== undefined ? level : 'info';
    }

    setPrefix(prefix) {
        this._prefix = prefix || '';
        return this;
    }

    get prefix() {
        return this._prefix;
    }

    setLevel(level) {
        if (this._levels[level] === undefined) return this;
        this._level = level;
        return this;
    }

    get level() {
        return this._level;
    }

    enable() {
        this._enabled = true;
        return this;
    }

    disable() {
        this._enabled = false;
        return this;
    }

    child(suffix) {
        const join = this._prefix && suffix ? `${this._prefix}:${suffix}` : suffix || this._prefix;
        return new Logger({ prefix: join, level: this._level, enabled: this._enabled });
    }

    _shouldLog(level) {
        return this._enabled && this._levels[level] >= this._levels[this._level];
    }

    _fmt(args) {
        if (!this._prefix) return args;
        // Prepend a consistent prefix token; colorize a bit in consoles that support %c
        const prefixToken = this._prefix;
        return [`${prefixToken}`, ...args];
    }

    debug(...args) {
        if (!this._shouldLog('debug')) return;
        console.debug(...this._fmt(args));
    }

    log(...args) {
        if (!this._shouldLog('log')) return;
        console.log(...this._fmt(args));
    }

    info(...args) {
        if (!this._shouldLog('info')) return;
        console.info(...this._fmt(args));
    }

    warn(...args) {
        if (!this._shouldLog('warn')) return;
        console.warn(...this._fmt(args));
    }

    error(...args) {
        if (!this._shouldLog('error')) return;
        console.error(...this._fmt(args));
    }
}

export const keLogger = new Logger({ prefix: '[pf1-ke]', level: 'info', enabled: true });
