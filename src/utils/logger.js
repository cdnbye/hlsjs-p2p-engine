import { getQueryParam } from './toolFuns';

const logTypes = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    none: 4,
};

const typesP = ['_debugP', '_infoP', '_warnP', '_errorP'];

class Logger {
    constructor(config, channel) {

        this.config = config;

        if (config.logLevel === true || getQueryParam('_debug') === '1') {
            config.logLevel = 'debug';
        } else if (!(config.logLevel in logTypes) || config.logLevel === false) {
            config.logLevel = 'none';
        }
        for (let i=0;i<logTypes[config.logLevel];i++) {
            this[typesP[i]] = noop;
        }
    }

    debug(msg) {
        this._debugP(msg);
    }

    info(msg) {
        this._infoP(msg);
    }

    warn(msg) {
        this._warnP(msg);
    }

    error(msg) {
        this._errorP(msg);
    }

    _debugP(msg) {
        console.log(msg);
    }

    _infoP(msg) {
        console.info(msg);
    }

    _warnP(msg) {
        console.warn(msg);
    }

    _errorP(msg) {
        console.error(msg);
    }
}

function noop() {

}

export default Logger;