
export default class TimeKeeper {

    constructor(config) {

        this.config = config;
        /*
           tPlaying: 正在播放的ts开始的时刻
           tLoaded: 加载完成的ts开始的时刻
         */
        this.tPlaying = this.tLoaded = performance.now();
        this.playingSN = this.loadedSN = -1;

    }

    setPlayingSN(sn) {
        this.playingSN = sn;
        this.tPlaying = performance.now();
    }

    setLoadedSN(sn) {
        this.loadedSN = sn;
        this.tLoaded = performance.now();
    }

    get p2pTimeout() {

    }

}