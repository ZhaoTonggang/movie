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
	for (let i in e) {
		arre += e[i] + '\t';
	}
	return arre;
}
// 猜你喜欢
const guess = (c, a) => {
	fetch('https://server.heheda.top/movie/?cat=' + c + '&act=' + a, {
		methods: 'GET'
		// cache: 'force-cache',
		// mode: 'same-origin'
	}).then(response => response.json()).then(datas => {
		if (datas.code == 1) {
			let bdata = '';
			datas = datas.data.movies;
			for (let i in datas) {
				bdata += '<a target="_blank" href="./?cat=' + c + '&vid=' + encodeURI(datas[i].id) +
					'.html"><i style="background-image:url(' + datas[i].cdncover + '"></i><span>' + datas[i]
					.title + '</span></a>';
			}
			document.getElementById('guessList').innerHTML = bdata + '<span class="clear"></span>';
		} else {
			alert('网络错误！');
		}
	}).catch(e => console.error('[404]错误日志：', e))
}
// 获取选集
const getlist = () => {
	let jxv, stv;
	const allst = document.getElementsByName('sti');
	const alljx = document.getElementsByName('sjx');
	for (let j = 0; j < allst.length; j++) {
		if (allst[j].checked) {
			stv = allst[j].value;
		}
	}
	for (let i = 0; i < alljx.length; i++) {
		if (alljx[i].checked) {
			jxv = decodeURI(atob(alljx[i].value));
		}
	}
	console.log(jxv, stv)
	document.getElementById('play').src = jxv + stv;
}
// 初始化
if (window.top != window) {
	alert('当您看到这条提示意味着：您所访问的网站正在恶意调用本站资源，本站对偷盗资源的行为0容忍，点击确认跳转正版体验。');
	window.open(urldata, '_self');
} else if (urldata.indexOf('?') > -1 && urldata.indexOf('.html') > -1) {
	const urlarr = urldata.substring(urldata.indexOf('?') + 1, urldata.indexOf('.html'));
	const urlarrs = urlarr.split('&');
	for (let i = 0; i < urlarrs.length; i++) {
		let data = urlarrs[i].split('=');
		if (data == "") {
			alert('网络错误！');
		} else {
			dataInfo[data[0]] = data[1];
		}
	}
	// 获取详细信息
	fetch('https://server.heheda.top/movie/?cat=' + dataInfo.cat + '&id=' + dataInfo.vid, {
		methods: 'GET'
		// cache: 'force-cache',
		// mode: 'same-origin'
	}).then(response => response.json()).then(datas => {
		if (datas.code == 1) {
			const titleItem = document.getElementById('titleItem');
			const jiexi = ['aHR0cHM6Ly9qeC54bWZsdi5jb20vP3VybD0=', 'aHR0cHM6Ly9qeC5wbGF5ZXJqeS5jb20vP3VybD0=',
				'aHR0cHM6Ly9kbWp4Lm0zdTgudHYvP3VybD0=', 'aHR0cHM6Ly9qeC5tM3U4LnR2L2ppZXhpLz91cmw9',
				'aHR0cHM6Ly9qeC5haWRvdWVyLm5ldC8/dXJsPQ=='
			];
			const cjxlist = Object.keys(jiexi)[0];
			let jxvalue = '';
			let stvalue = '';
			datas = datas.data;
			titleItem.innerText = datas.title;
			document.getElementById('morei').style.backgroundImage = 'url(' + datas.cdncover + ')';
			document.getElementById('moreh5').innerText = datas.title;
			document.getElementById('mddiv').innerText += datas.description;
			document.getElementById('span1').innerText += arr(datas.area);
			document.getElementById('span2').innerText += arr(datas.moviecategory);
			document.getElementById('span3').innerText += arr(datas.actor);
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
			const cstlist = Object.keys(playurl)[0];
			for (let p in playurl) {
				let b = p;
				if (p in siteList) {
					b = siteList[p];
				}
				if (p == cstlist) {
					stvalue += '<input checked type="radio" name="sti" value="' + playurl[p].default_url +
						'"id="' + p + '" onclick="getlist()"/><label for="' + p + '">' + b + '</label>';
				} else {
					stvalue += '<input type="radio" name="sti" value="' + playurl[p].default_url + '"id="' +
						p + '" onclick="getlist()"/><label for="' + p + '">' + b + '</label>';
				}
			}
			document.getElementById('stList').innerHTML = stvalue;
			// 解析线路
			for (let a in jiexi) {
				if (a == cjxlist) {
					jxvalue += '<input checked type="radio" name="sjx" value="' + jiexi[a] + '"id="' + a +
						'" onclick="getlist()"/><label for="' + a + '">线路' + a + '</label>';
				} else {
					jxvalue += '<input type="radio" name="sjx" value="' + jiexi[a] + '"id="' + a +
						'" onclick="getlist()"/><label for="' + a + '">线路' + a + '</label>';
				}
			}
			document.getElementById('jxList').innerHTML = jxvalue;
		} else {
			alert('网络错误！');
		}
	}).catch(e => console.error('[404]错误日志：', e))
}