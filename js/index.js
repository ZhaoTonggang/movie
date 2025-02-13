// 严格模式
"use strict";
// 获取轮播
fetch('https://server.heheda.top/movie/', {
	methods: 'GET'
	// cache: 'force-cache',
	// mode: 'same-origin'
}).then(response => response.json()).then(datas => {
	if (datas.code == 1 && datas.data.length > 0) {
		let bdata = '';
		datas = datas.data;
		for (let i in datas) {
			bdata += '<li><a target="_blank" href="./play/?cat=' + datas[i].cat + '&vid=' + encodeURI(datas[i]
					.ent_id) + '.html"><i style="background-image:url(' + datas[i].pic_lists[0].url +
				'"></i><span>' + datas[i].title + '></span></a></li>';
		}
		document.getElementById('bannerList').innerHTML = bdata;
	} else {
		alert('网络错误！');
	}
}).catch(e => console.error('[404]错误日志：', e))
// 获取首页数据
const list = (j, id) => {
	fetch('https://server.heheda.top/movie/?cat=' + j, {
		methods: 'GET'
		// cache: 'force-cache',
		// mode: 'same-origin'
	}).then(response => response.json()).then(datas => {
		if (datas.code == 1 && datas.data.length > 0) {
			let idata = '';
			let dom;
			datas = datas.data;
			for (let i in datas) {
				idata += '<a target="_blank" href="./play/?cat=' + datas[i].cat + '&vid=' + encodeURI(datas[
						i].ent_id) + '.html"><i style="background-image:url(' + datas[i].cover + ')"><b>' +
					datas[i].pv + '</b></i><span>' + datas[i].title + '</span></a>';
			}
			document.getElementById(id).innerHTML = idata + '<span class="clear"></span>';
		} else {
			alert('网络错误！');
		}
	}).catch(e => console.error('[404]错误日志：', e))
}
list(2, 'dianyingList');
list(3, 'dianshiList');
list(4, 'zongyiList');
list(5, 'dongmanList');