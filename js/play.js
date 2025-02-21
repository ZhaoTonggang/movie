// 严格模式
"use strict";
// 必要信息
let dataInfo = {};
const urldata = window.location.href;
// 处理数组
const arr = (e, y) => {
	if (y) {
		return e[0];
	}
	let arre = '';
	for (let i = 0, len = e.length; i < len; i++) {
		arre += e[i] + '\t';
	}
	return arre;
}
// 剧集
const juji = async (c, a, t, s) => {
	let start = 1;
	let end = t;
	let jjdata = '';
	if (t && t != 0) {
		if (t > 100) {
			end = 100;
			t = Math.ceil(t / 100)
		} else {
			t = 1;
		}
	} else {
		alert('获取剧集失败！');
	}
	for (let i = 1; i <= t; i++) {
		end = end * i;
		await post('cat=' + c + '&id=' + a + '&start=' + start + '&end=' + end + '&site=' + s).then(datas => {
			datas = datas.data.allepidetail[s];
			for (let d = 0, len = datas.length; d < len; d++) {
				jjdata += '<input type="radio" name="sjj" value="' + datas[d].url + '"id="jj' + d +
					'" onclick="getlist()"/><label for="jj' + d + '">第' + datas[d].playlink_num +
					'集</label>';
			}
		}).catch(e => console.error('[404]错误日志：', e));
		start = end;
	}
	document.getElementById('episodesList').innerHTML = jjdata;
}
// 猜你喜欢
const guess = (c, a) => {
	post('cat=' + c + '&act=' + a).then(datas => {
		if (datas.code == 1) {
			let bdata = '';
			datas = datas.data.movies;
			for (let i = 0, len = datas.length; i < len; i++) {
				bdata += '<a target="_blank" href="./?cat=' + c + '&vid=' + encodeURI(datas[i].id) +
					'.html"><i style="background-image:url(' + datas[i].cdncover + '"></i><span>' + datas[i]
					.title + '</span></a>';
			}
			document.getElementById('guessList').innerHTML = bdata;
		} else {
			alert('网络错误！');
		}
	}).catch(e => console.error('[404]错误日志：', e))
}
// value值遍历器
const getvl = (a) => {
	const avl = document.getElementsByName(a);
	for (let i = 0, len = avl.length; i < len; i++) {
		if (avl[i].checked) {
			return avl[i].value;
		}
	}
}
// 播放
const getlist = () => {
	document.getElementById('play').src = decodeURI(atob(getvl('sjx'))) + ((dataInfo.cat != 1) ? getvl('sjj') :
		getvl('sti'));
}
// 初始化
if (window.top != window) {
	alert('当您看到这条提示意味着：您所访问的网站正在恶意调用本站资源，本站对偷盗资源的行为0容忍，点击确认跳转正版体验。');
	window.open(urldata, '_self');
} else if (urldata.indexOf('?') > -1 && urldata.indexOf('.html') > -1) {
	const urlarr = urldata.substring(urldata.indexOf('?') + 1, urldata.indexOf('.html'));
	const urlarrs = urlarr.split('&');
	for (let i = 0, len = urlarrs.length; i < len; i++) {
		let data = urlarrs[i].split('=');
		if (data == "") {
			alert('网络错误！');
		} else {
			dataInfo[data[0]] = data[1];
		}
	}
	// 获取详细信息
	post('cat=' + dataInfo.cat + '&id=' + dataInfo.vid).then(datas => {
		if (datas.code == 1) {
			const jiexi = ['aHR0cHM6Ly9qeC54bWZsdi5jb20vP3VybD0=', 'aHR0cHM6Ly9qeC5wbGF5ZXJqeS5jb20vP3VybD0=',
				'aHR0cHM6Ly9kbWp4Lm0zdTgudHYvP3VybD0=', 'aHR0cHM6Ly9qeC5tM3U4LnR2L2ppZXhpLz91cmw9',
				'aHR0cHM6Ly9qeC5haWRvdWVyLm5ldC8/dXJsPQ=='
			];
			let jxvalue = '';
			let stvalue = '';
			datas = datas.data;
			document.title = '正在放映:《' + datas.title + '》- 风影阁';
			document.getElementById('titleItem').innerHTML += '《' + datas.title + '》';
			document.getElementById('morei').style.backgroundImage = 'url(' + datas.cdncover + ')';
			document.getElementById('moreh5').innerHTML = datas.title;
			document.getElementById('mddiv').innerHTML += datas.description;
			document.getElementById('span1').innerHTML += arr(datas.area);
			document.getElementById('span2').innerHTML += arr(datas.moviecategory);
			document.getElementById('span3').innerHTML += arr(datas.actor);
			guess(dataInfo.cat, arr(datas.actor, 'y'));
			// 获取平台
			const siteList = {
				'imgo': '芒果',
				'qiyi': '爱奇艺',
				'qq': '腾讯',
				'youku': '优酷',
				'xigua': '西瓜',
				'douyin': '抖音',
				'bilibili1': '哔哩哔哩',
				'leshi': '乐视',
				'sohu': '搜狐',
				'cntv': '央视TV',
				'huashu': '华数',
				'm1905': 'M1905',
				'huanxi': '欢喜首映'
			}
			let playurl = datas.playlinksdetail;
			let upinfo = datas.allupinfo;
			let pst;
			for (let p in playurl) {
				pst = p;
				let b = (p in siteList) ? siteList[p] : b;
				let plch = (p == Object.keys(playurl)[0]) ? 'checked' : '';
				// 判断是否为影片
				let plvl = (dataInfo.cat != 1) ? p : playurl[p].default_url;
				let clk = (dataInfo.cat != 1) ? 'juji(' + dataInfo.cat + ',\'' + dataInfo.vid + '\',' + upinfo[
						p] +
					',\'' + p + '\')' : 'getlist()';
				stvalue += '<input ' + plch + ' type="radio" name="sti" value="' + plvl + '"id="' + p +
					'" onclick="' + clk + '"/><label for="' + p + '">' + b + '</label>';
			}
			document.getElementById('stList').innerHTML = stvalue;
			// 解析线路
			for (let a = 0, len = jiexi.length; a < len; a++) {
				let cjch = (a == Object.keys(jiexi)[0]) ? 'checked' : '';
				jxvalue += '<input ' + cjch + ' type="radio" name="sjx" value="' + jiexi[a] + '"id="' + a +
					'" onclick="getlist()"/><label for="' + a + '">线路' + a + '</label>';
			}
			document.getElementById('jxList').innerHTML = jxvalue;
			// 自动解析剧集
			if (dataInfo.cat != 1) {
				juji(dataInfo.cat, dataInfo.vid, upinfo[pst], pst);
			}
		} else {
			alert('网络错误！');
		}
	}).catch(e => console.error('[404]错误日志：', e))
}
// 搜索
const so = () => {
	const value = encodeURI(document.getElementById('search').value.replace(/\s+/g, ''));
	if (value != '') {
		window.open('./search/?' + value + '.html');
	} else {
		alert('请输入关键词！');
	}
}
// 回车搜索
window.onkeydown = () => {
	if (window.event && window.event.keyCode == 13 && search == document.activeElement) {
		so();
	}
}