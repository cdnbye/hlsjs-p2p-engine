/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


/**
 * Created by xieting on 2018/1/2.
 */
// import HlsPeerify from '../dist/hls-peerify';
// import Hls from 'hls.js';
// import Hls from '../dist/hls-peerify-bundle';
// var Hls = require('../dist/hls-peerify-bundle');

// import Hls from '../../src/index.hls';

if (Hls.isSupported()) {
    var video = document.querySelector('#video');
    video.muted = true;

    var hlsjsConfig = {
        // debug: true,
        //      pLoader : pLoader,
        p2pConfig: {
            logLevel: 'debug'
        }
    };

    var hls = new Hls(hlsjsConfig);
    // new HlsPeerify(hls, p2pConfig);

    // hls.loadSource('https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8');
    //        hls.loadSource('https://video-dev.github.io/streams/test_001/stream.m3u8');
    //        hls.loadSource('http://112.90.52.139/hls/test.m3u8');
    hls.loadSource('https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8');
    hls.attachMedia(video);
    hls.on(Hls.Events.MANIFEST_PARSED, function (event, data) {
        hls.loadLevel = 0;
        video.play();
        // cpm.downloadresult.classList.remove('sr-only');
    });
    //     hls.on(Hls.Events.FRAG_LOADED, (id, data) => {
    //         var frag = data.frag;
    // //            console.warn(`sn ${frag.sn} relurl ${frag.relurl} level ${frag.level} downloaded ${frag.loaded} source ${frag.loadByXhr?'CDN':'P2P'}`);
    //         var source = frag.loadByXhr?'CDN':'P2P';
    //         addToTable(frag.sn, frag.relurl, frag.level, frag.loaded, source);
    //     });
    //
    hls.on(Hls.Events.ERROR, function (event, data) {
        var errorType = data.type;
        var errorDetails = data.details;
        var errorFatal = data.fatal;
        console.warn('warn details:' + errorDetails);
        //      switch(data.details) {
        //        case hls.ErrorDetails.FRAG_LOAD_ERROR:
        //          // ....
        //          break;
        //        default:
        //          break;
        //      }
    });
}

/***/ })
/******/ ]);