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
// 写入最近观看
const putDB = async (id, tit, img) => {
	if (!id || !tit || !img) {
		console.error("写入数据为空！");
		return false;
	}
	try {
		// 打开数据库
		db = await openDatabase();
		// 执行数据写入操作
		return await new Promise((resolve, reject) => {
			const transaction = db.transaction([storeName], "readwrite");
			const request = transaction.objectStore(storeName).put({
				play: id.trim(),
				title: tit.trim(),
				img: img.trim(),
				time: new Date().getTime()
			});
			request.onsuccess = () => {
				console.log("数据写入成功！");
				resolve(true);
			};
			request.onerror = (e) => {
				const error = new Error("数据写入出错: " + e.target.error);
				console.error("操作失败:", error);
				reject(error);
			};
			// 事务完成处理
			transaction.oncomplete = () => console.debug("事务完成");
			transaction.onerror = (e) => console.error("事务出错:", e.target.error);
		});
	} catch (error) {
		console.error("操作失败:", error);
		return false;
	} finally {
		// 关闭数据库
		if (db) {
			db.close();
			console.debug("数据库已关闭");
		}
	}
};
// 剧集
const juji = async (c, a, t, s) => {
	let start = 1;
	let jjdata = '';
	let ts = 1;
	if (t && t > 0) {
		ts = t > 200 ? Math.ceil(t / 200) : 1
	} else {
		return alert('获取剧集失败！');
	}
	for (let i = 1; i <= ts; i++) {
		let end = t < 200 * i ? t : 200 * i;
		await post('detail', 'cat=' + c + '&id=' + a + '&start=' + start + '&end=' + end + '&site=' + s).then(
			datas => {
				if (datas.code == 1) {
					datas = datas.data.allepidetail[s];
					for (let d = 0, len = datas.length; d < len; d++) {
						jjdata += '<input type="radio" name="sjj" value="' + datas[d].url + '"id="' + i +
							'-' + d + '" onclick="getlist()"/><label for="' + i + '-' + d + '">第' +
							datas[d].playlink_num + '集</label>';
					}
				} else {
					jjdata = '<div class="no-data">无法获取剧集列表，请尝试切换平台</div>';
				}
			}).catch(e => console.error('[404]错误日志：', e));
		start = end + 1;
	}
	document.getElementById('episodesList').innerHTML = jjdata;
}
// 综艺类剧集
const zyjuji = async (c, a, n, s) => {
	let zydata = '';
	n = Object.keys(n);
	for (let j = 0, len = n.length; j < len; j++) {
		await post('detail', 'cat=' + c + '&id=' + a + '&year=' + n[j] + '&site=' + s).then(datas => {
			if (datas.code == 1) {
				datas = datas.data.defaultepisode;
				for (let i = 0, len = datas.length; i < len; i++) {
					zydata += '<input type="radio" name="sjj" value="' + datas[i].url + '"id="' + j +
						'-' + i + '" onclick="getlist()"/><label for="' + j + '-' + i + '">' + datas[i]
						.period + '</label>';
				}
			} else {
				zydata = '<div class="no-data">无法获取剧集列表，请尝试切换平台</div>';
			}
		}).catch(e => console.error('[404]错误日志：', e));
	}
	document.getElementById('episodesList').innerHTML = zydata;
}
// 猜你喜欢
const guess = (c, a) => {
	post('query', 'cat=' + c + '&act=' + a).then(datas => {
		if (datas.code == 1) {
			let bdata = '';
			datas = datas.data.movies;
			for (let i = 0, len = datas.length; i < len; i++) {
				let coverData = /https:\/\//i.test(datas[i].cdncover) ? datas[i].cdncover : ('https:' +
					datas[i].cdncover);
				bdata += '<a href="./?' + btoa(encodeURI(c + '&' + datas[i].id)) + '.html"><img src="' +
					coverData + '" alt="' + datas[i].title + '" loading="lazy" /><p>' + datas[i]
					.title + '</p></a>';
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
	document.getElementById('play').src = decodeURI(atob(getvl('sjx'))) + ((dataInfo[0] != 1) ? getvl('sjj') :
		getvl('sti'));
}
// 初始化
if (window.top != window) {
	alert('当您看到这条提示意味着：您所访问的网站正在恶意调用本站资源，本站对偷盗资源的行为0容忍，点击确认跳转正版体验。');
	window.open(urldata, '_self');
} else if (urldata.indexOf('?') > -1 && urldata.indexOf('.html') > -1) {
	const playId = urldata.substring(urldata.indexOf('?') + 1, urldata.indexOf('.html'));
	dataInfo = decodeURI(atob(playId)).split('&');
	// 获取详细信息
	post('detail', 'cat=' + dataInfo[0] + '&id=' + dataInfo[1]).then(datas => {
		if (datas.code == 1) {
			const jiexi = ['aHR0cHM6Ly9qeC54bWZsdi5jb20vP3VybD0=', 'aHR0cHM6Ly9qeC5wbGF5ZXJqeS5jb20vP3VybD0=',
				'aHR0cHM6Ly9kbWp4Lm0zdTgudHYvP3VybD0=', 'aHR0cHM6Ly9qeC5tM3U4LnR2L2ppZXhpLz91cmw9',
				'aHR0cHM6Ly9qeC5haWRvdWVyLm5ldC8/dXJsPQ=='
			];
			let jxvalue = '';
			let stvalue = '';
			const morei = document.getElementById('morei');
			datas = datas.data;
			document.title = '正在放映:《' + datas.title + '》- 风影阁';
			document.getElementById('titleItem').innerHTML += '《' + datas.title + '》';
			morei.src = datas.cdncover;
			morei.alt = datas.title;
			document.getElementById('moreh5').innerHTML = datas.title;
			document.getElementById('mddiv').innerHTML += datas.description;
			document.getElementById('span1').innerHTML += arr(datas.area);
			document.getElementById('span2').innerHTML += arr(datas.moviecategory);
			document.getElementById('span3').innerHTML += arr(datas.director);
			document.getElementById('span4').innerHTML += arr(datas.actor);
			guess(dataInfo[0], arr(datas.actor, 'y'));
			// putDB
			putDB(playId, datas.title, datas.cdncover);
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
				'huanxi': '欢喜首映',
				'pptv': 'PP视频'
			}
			let playurl = datas.playlinksdetail;
			let upinfo = datas.allupinfo;
			let years = datas.tag;
			let t;
			for (let p in playurl) {
				t = Object.keys(playurl)[0];
				let b = (p in siteList) ? siteList[p] : p;
				let plch = (p == t) ? 'checked' : '';
				// 判断视频类型
				let plvl = (dataInfo[0] != 1) ? p : playurl[p].default_url;
				let clk = (dataInfo[0] == 1) ? 'getlist()' : (dataInfo[0] == 3) ? 'zyjuji(' + dataInfo[0] +
					',\'' + dataInfo[1] + '\',' + years + ',\'' + p + '\')' : 'juji(' + dataInfo[0] + ',\'' +
					dataInfo[1] + '\',' + upinfo[p] + ',\'' + p + '\')';
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
			if (dataInfo[0] == 2 || dataInfo[0] == 4) {
				document.getElementById('episodesBox').style.display = 'block';
				juji(dataInfo[0], dataInfo[1], upinfo[t], t);
			}
			if (dataInfo[0] == 3) {
				document.getElementById('episodesBox').style.display = 'block';
				zyjuji(dataInfo[0], dataInfo[1], years, t);
			}
		} else {
			alert('网络错误！');
		}
	}).catch(e => console.error('[404]错误日志：', e))
} else {
	alert('请求参数错误，即将返回首页');
	window.open('../', '_self');
}