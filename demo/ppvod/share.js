var time = 0;
var _CK_ = null;
var bOpen = 0;
var bObj = null;
var msgcache = {}
var player;
function BrowserType() {
	var userAgent = navigator.userAgent; //取得浏览器的userAgent字符串
	var isOpera = userAgent.indexOf("Opera") > -1; //判断是否Opera浏览器
	// var isIE = userAgent.indexOf("compatible") > -1 && userAgent.indexOf("MSIE") > -1 && !isOpera; //判断是否IE浏览器
	var isIE = window.ActiveXObject || "ActiveXObject" in window
	// var isEdge = userAgent.indexOf("Windows NT 6.1; Trident/7.0;") > -1 && !isIE; //判断是否IE的Edge浏览器
	var isEdge = userAgent.indexOf("Edge") > -1; //判断是否IE的Edge浏览器
	var isFF = userAgent.indexOf("Firefox") > -1; //判断是否Firefox浏览器
	var isSafari = userAgent.indexOf("Safari") > -1 && userAgent.indexOf("Chrome") == -1; //判断是否Safari浏览器
	var isChrome = userAgent.indexOf("Chrome") > -1 && userAgent.indexOf("Safari") > -1 && !isEdge; //判断Chrome浏览器

	if (isIE) {
		var reIE = new RegExp("MSIE (\\d+\\.\\d+);");
		reIE.test(userAgent);
		var fIEVersion = parseFloat(RegExp["$1"]);
		if (userAgent.indexOf('MSIE 6.0') != -1) {
			return "IE6";
		} else if (fIEVersion == 7) { return "IE7"; }
		else if (fIEVersion == 8) { return "IE8"; }
		else if (fIEVersion == 9) { return "IE9"; }
		else if (fIEVersion == 10) { return "IE10"; }
		else if (userAgent.toLowerCase().match(/rv:([\d.]+)\) like gecko/)) {
			return "IE11";
		}
		else { return "0" }//IE版本过低
	}//isIE end

	if (isFF) { return "FF"; }
	if (isOpera) { return "Opera"; }
	if (isSafari) { return "Safari"; }
	if (isChrome) { return "Chrome"; }
	if (isEdge) { return "Edge"; }
}//myBrowser() end


function SetCookie(name, value) {
	var Days = 30;
	var exp = new Date();
	exp.setTime(exp.getTime() + Days * 24 * 60 * 60 * 1000);
	document.cookie = name + "=" + escape(value) + ";expires=" + exp.toGMTString();
}
function getCookie(name) {
	var arr = document.cookie.match(new RegExp("(^| )" + name + "=([^;]*)(;|$)"));
	if (arr != null) return unescape(arr[2]); return null;
}
window.onerror = function () {
	return true;
}
function crossdomainCheck() {
	if (!hosts) return;
	var referagent = document.referrer;
	if (redirecturl.indexOf("http") != 0 && redirecturl.indexOf("https") != 0)
		redirecturl = "http://" + redirecturl
	if (!referagent)
		return top.location.href = redirecturl;

	var hostsarr = hosts.split("|");
	var refer = false;
	var url = referagent;
	var reg = /^http(s)?:\/\/(.*?)\//;

	for (var i = 0; i <= hostsarr.length; i++) {
		if (reg.exec(url) && reg.exec(url)[2].indexOf(hostsarr[i]) >= 0) {
			refer = true;
			break;
		}
	};
	if (!refer) {
		top.location.href = redirecturl;
	};
}

function orderviewinit(timeout) {
	var isAndroid = navigator.userAgent.indexOf('Android') > -1 || u.indexOf('Adr') > -1; //android终端
	var isIOS = false;
	if (/(iPhone|iPad|iPod|iOS)/i.test(navigator.userAgent))
		isIOS = true
	if (isIOS || isAndroid) {
		$("#orderview").css("width", "280px");
		$("#orderview").css("height", "320px");
		$("#orderview").css("left", "280px");
		/**
		$("#orderview").css("margin-left", "0px");
		$("#orderview").css("margin-top", "0px");
		$("#orderview").css("bototm", "10px");
		$("#orderview").css("left", "-20px");
		$("#orderview").css("display", "block");
		$("#mvideo").css("height", "260px");

		$(".closeview").hide()
		*/

	}
	$(".closeview").click(function () {
		$("#orderview").hide();
	});
	player.on('pause', function () {
		$("#orderview").show();
	})

}


function init(order) {

	crossdomainCheck();
	var cookieTime = getCookie(videoid + "_time"); //调用已记录的time
	//alert("上次播放时间"+ cookieTime +"");
	if (!cookieTime || cookieTime == undefined) { //如果没有记录值，则设置时间0开始播放
		cookieTime = 0;
	}
	function cb() {
		if (order)
			orderviewinit();
	}

	if (playertype == 'ckplayer')
		ckplay(main, xml, cookieTime, cb);
	else
		dplay(main, xml, cookieTime, cb);




}
function timeHandler(t) {
	if (t > -1)
		SetCookie(videoid + "_time", t);
}
function loadHandler() {
	player.addListener('time', timeHandler); //监听播放时间
}

//ckplayer
function ckplay(main, xml, starttime, cb) {
	var hostname = window.location.hostname
	var port = window.location.port || '80';
	var picurl = window.location.protocol + "//" + window.location.host + pic;
	var url = window.location.protocol + "//" + window.location.host + main
	if (main.indexOf("/") != 0)
		url = window.location.protocol + "//" + window.location.host + "/" + main
	xml = window.location.protocol + "//" + window.location.host + xml
	var isiPad = navigator.userAgent.match(/iPhone|Linux|Android|iPad|iPod|ios|iOS|Windows Phone|Phone|WebOS/i) != null;
	if (isiPad) {
		document.getElementById('mvideo').innerHTML = '<video src="' + url + '" poster="' + picurl + '" controls="controls" webkit-playsinline="true" style="width: 100%; height: 100%; background-color: rgb(0, 0, 0);" width="100%" height="100%"></video>'
	} else {
		var videoObject = {
			container: '.video',
			variable: 'player',
			loaded: 'loadHandler',
			autoplay: true,
			poster: picurl,
			adfront: l, //前置广告
			adfronttime: t,
			adfrontlink: r,
			adpause: d,//暂停广告
			adpausetime: t,
			adpauselink: u,
			video: url
		};
	}

	if (starttime > 0) {
		videoObject['seek'] = starttime;
	}
	player = new ckplayer(videoObject);
	cb();


}
var p2pdown = 0;

//获得多码率列表
function getPlayList(url, cb) {

	$.get(url, function (result) {
		cb(null, result);
	})
}

function getproxyurl(torrent, url, cb) {
	if (torrent == "") return cb(url);
	MPlayer.isReady(function (err) {
		if (err) return cb(url)
		MPlayer.play(torrent, function (err, newurl) {
			if (newurl) return cb(newurl)
			return cb(url)
		})
	})
}
//dplayer
var _peerId = '', _peerNum = 0, _totalP2PDownloaded = 0, _totalP2PUploaded = 0;
function dplay(main, xml, starttime, cb) {
	var hostname = window.location.hostname
	var port = window.location.port || '80';
	var picurl = window.location.protocol + "//" + window.location.host + pic;
	var url = window.location.protocol + "//" + window.location.host + main
	if (main.indexOf("/") != 0)
		url = window.location.protocol + "//" + window.location.host + "/" + main
	xml = window.location.protocol + "//" + window.location.host + xml

	if (window.location.protocol.indexOf("https") >= 0)
		port = window.location.port ? window.location.port : 443
	else
		port = window.location.port ? window.location.port : 80
	// magnet = "";
	getproxyurl(magnet, url, function (url) {
		//分析url 获取播放列表
		getPlayList(url, function (err, result) {
			// var cdn = new NGCdn(cfg);

			var danmaku = {
				id: videoid,                                        // Required, danmaku id, MUST BE UNIQUE, CAN NOT USE THESE IN YOUR NEW PLAYER: `https://dplayer.daoapp.io/list`
				api: '/',                             // Required, danmaku api
				token: 'tokendemo',                                            // Optional, danmaku token for api
				unlimited: true,
				maximum: 100
			}
			//danmaku : danmaku,
			var playcfg = {
				container: document.getElementById('mvideo'),
				screenshot: true,
				pic: pic,
				video: {
					url: url,
                    type: 'customHls',
                    customType: {
                        'customHls': function (video, player) {
                            const hls = new Hls({
                                debug: false,
                                // Other hlsjsConfig options provided by hls.js
                                p2pConfig: {
                                    // logLevel: 'debug',
                                    live: false,        // 如果是直播设为true
                                    channelId: function (m3u8Url) {
                                        return videoid;
                                    }
                                    // Other p2pConfig options provided by CDNBye
                                }
                            });
                            hls.loadSource(video.src);
                            hls.attachMedia(video);
                            hls.p2pEngine.on('stats', function (stats) {
                                _totalP2PDownloaded = stats.totalP2PDownloaded;
                                _totalP2PUploaded = stats.totalP2PUploaded;
                                // updateStats();
                            }).on('peerId', function (peerId) {
                                _peerId = peerId;
                            }).on('peers', function (peers) {
                                _peerNum = peers.length;
                                // updateStats();
                            });

                        }
                    }
				},
			};
			if (danmuenable == 1)
				playcfg.danmaku = danmaku



			//多码率
			if (result) {
				var labels = ["标清", "高清", "超清", "蓝光"]
				var parser = new m3u8Parser.Parser();
				parser.push(result);
				parser.end();
				var qualitys = [];
				var playlist = parser.manifest.playlists;
				if (playlist && playlist.length > 1) {
					// console.log(playlist)
					//if proxy replace

					for (var i = 0; i < playlist.length; i++) {
						let rurl = playlist[i].uri
						if (url.indexOf(":1220") > 0)
							rurl = url.replace("index.m3u8", playlist[i].uri)
						qualitys.push({
							name: labels[i],
							url: rurl,
							type: 'hls'
						})
						// console.log(rurl)
					}
					playcfg.video.quality = qualitys
					delete playcfg.video.url;
					playcfg.video.defaultQuality = 0;
					// console.log(playcfg)
				}
			}
			player = new DPlayer(playcfg);

			player.on('timeupdate', function () {

				var t = player.video.currentTime;
				if (t > 0)
					SetCookie(videoid + "_time", t);
			})
			if (starttime > 0)
				player.seek(starttime)


			player.play();
			cb();
		})

	})
}