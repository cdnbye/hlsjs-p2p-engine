/**
 * Created by xieting on 2018/4/16.
 */
import ReconnectingWebSocket from 'reconnecting-websocket';

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
    constructor(config) {

        this.config = config;
        this.connected = false;
        if (config.enableLogUpload) {
            this._ws = this._initWs();
        }
        if (!(config.logLevel in logTypes)) config.logLevel = 'none';
        if (!(config.logUploadLevel in logTypes)) config.logUploadLevel = 'none';
        for (let i=0;i<logTypes[config.logLevel];i++) {
            this[typesP[i]] = noop;
        }
        for (let i=0;i<logTypes[config.logUploadLevel];i++) {
            this[typesU[i]] = noop;
        }
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
        console.log(`_debugU`);
    }

    _infoU(msg) {
        console.log(`_infoU`);
    }

    _warnU(msg) {
        console.log(`_warnU`);
    }

    _errorU(msg) {
        console.log(`_errorU`);
    }

    _initWs() {
        const wsOptions = {
            maxRetries: this.config.wsMaxRetries,
            minReconnectionDelay: this.config.wsReconnectInterval*1000
        };
        let ws = new ReconnectingWebSocket(this.config.logUploadAddr, undefined, wsOptions);
        ws.onopen = () => {
            console.log('Log websocket connection opened');

            this.connected = true;

        };

        ws.push = ws.send;
        ws.send = msg => {
            if (ws.readyState !== 1) {
                console.warn('websocket connection is not opened yet.');
                return setTimeout(function() {
                    ws.send(msg);
                }, 1000);
            }
            ws.push(msg);
        };
        ws.onmessage = (e) => {


        };
        ws.onclose = () => {                                            //websocket断开时清除datachannel
            console.warn(`Log websocket closed`);
            this.connected = false;
        };
        return ws;
    }
}

function noop() {

}

export default Logger;