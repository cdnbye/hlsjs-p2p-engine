import ReconnectingWebSocket from 'reconnecting-websocket';
import { getQueryParam } from './toolFuns';

const logTypes = {
    debug: 0,
    info: 1,
    warn: 2,
    error: 3,
    none: 4,
};

const typesP = ['_debugP', '_infoP', '_warnP', '_errorP'];
const typesU = ['_debugU', '_infoU', '_warnU', '_errorU'];

class Logger {
    constructor(config, channel) {

        this.config = config;
        this.connected = false;
        if (config.enableLogUpload) {
            try {
                this._ws = this._initWs(channel);
            } catch (e) {
                this._ws = null;
            }
        }

        if (config.logLevel === true || getQueryParam('_debug') === '1') {
            config.logLevel = 'debug';
        } else if (!(config.logLevel in logTypes) || config.logLevel === false) {
            config.logLevel = 'none';
        }
        if (!(config.logUploadLevel in logTypes)) config.logUploadLevel = 'none';
        for (let i=0;i<logTypes[config.logLevel];i++) {
            this[typesP[i]] = noop;
        }
        for (let i=0;i<logTypes[config.logUploadLevel];i++) {
            this[typesU[i]] = noop;
        }
        this.identifier = '';
    }

    debug(msg) {
        this._debugP(msg);
        this._debugU(msg);
    }

    info(msg) {
        this._infoP(msg);
        this._infoU(msg);
    }

    warn(msg) {
        this._warnP(msg);
        this._warnU(msg);
    }

    error(msg) {
        this._errorP(msg);
        this._errorU(msg);
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

    _debugU(msg) {
        msg = `[${this.identifier} debug] > ${msg}`
        this._uploadLog(msg);
    }

    _infoU(msg) {
        msg = `[${this.identifier} info] > ${msg}`
        this._uploadLog(msg);
    }

    _warnU(msg) {
        msg = `[${this.identifier} warn] > ${msg}`
        this._uploadLog(msg);
    }

    _errorU(msg) {
        msg = `[${this.identifier} error] > ${msg}`
        this._uploadLog(msg);
    }

    _uploadLog(msg) {
        if (!this.connected) return;
        this._ws.send(msg);
    }

    _initWs(channel) {
        const wsOptions = {
            maxRetries: this.config.wsMaxRetries,
            minReconnectionDelay: this.config.wsReconnectInterval*1000
        };
        let ws = new ReconnectingWebSocket(this.config.logUploadAddr+`?info_hash=${window.encodeURIComponent(channel)}`, undefined, wsOptions);
        ws.onopen = () => {
            this.debug('Log websocket connection opened');
            this.connected = true;
        };
        // ws.onmessage = (e) => {
        //
        //
        // };
        ws.onclose = () => {                                            //websocket断开时清除datachannel
            this.warn(`Log websocket closed`);
            this.connected = false;
        };
        return ws;
    }
}

function noop() {

}

export default Logger;