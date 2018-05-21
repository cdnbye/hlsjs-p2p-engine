<h1 align="center"><a href="" target="_blank" rel="noopener noreferrer"><img width="250" src="http://120.78.168.126/logo/cdnbye.png" alt="cdnbye logo"></a></h1>
<h4 align="center">It's time to say bye to CDN.</h4>


**[中文]()**

This JS library implements [WebRTC](https://en.wikipedia.org/wiki/WebRTC) datachannel to scale live/vod video streaming by peer-to-peer network using bittorrent-like protocol. Powed by [hls.js](https://github.com/video-dev/hls.js), it can play HLS on any platform with many popular HTML5 players such as video.js, Clappr and Flowplayer, even where it's not natively supported.  This library is a part of CDNBye project which attempts to deliver high quality video streams， decreasing the number of requests to CDN servers, reducing the cost of transmission and enhancing system’s scalability. As the name suggests, CDNBye will help you offload bandwidth from expensive traditional CDNs，while also maximizing a user’s viewing experience.

## Quick Start
Put the following code in your web page, run it(the seed, if no one else in the channel). Wait for a few seconds，then open the same page from another browser(the receiver). 
```javascript
<script src="https://cdn.jsdelivr.net/npm/cdnbye@latest"></script>
<video id="video" controls></video>
<p id="version"></p>
<h3>download info:</h3>
<p id="info"></p>
<table id="table-body">
    <tbody ></tbody>
</table>
<script>
    document.querySelector('#version').innerText = `hls.js version: ${Hls.version}  cdnbye version: ${Hls.pluginVersion}`;
    if(Hls.isSupported()) {
        var video = document.getElementById('video');
        var hls = new Hls();
        hls.loadSource('https://video-dev.github.io/streams/x36xhzz/x36xhzz.m3u8');
        hls.attachMedia(video);
        hls.on(Hls.Events.MANIFEST_PARSED,function(event, data) {
            hls.loadLevel = 0;
            video.play();
        });
        var total = 0, p2p = 0;
        hls.on(Hls.Events.FRAG_LOADED, (id, data) => {
            var frag = data.frag;
            var source = frag.loadByP2P === true ? 'P2P':'CDN';
            addToTable(frag.relurl, frag.loaded, source);
            total += frag.loaded;
            if (source === 'P2P') p2p += frag.loaded;
            document.querySelector('#info').innerText = `p2p ratio: ${Math.round(p2p/total*100)}%   saved traffic: ${Math.round(p2p/1024)}KB`;
        });
        function addToTable(url, downloaded, source) {
            var infoStr = `download ${url}(size:${downloaded}B) by ${source}`;
            document.querySelector('#table-body tbody').innerHTML +=
                `<tr style="text-align: center">
                    <td>${infoStr}</td>
                </tr>`
        };
    }
</script>
```






