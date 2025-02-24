// 严格模式
"use strict";
const urldata = window.location.href;
const so = (e) => {
	let value = '';
	if (e) {
		value = encodeURI(document.getElementById('search').value.replace(/\s+/g, ''));
	} else {
		value = urldata.substring(urldata.indexOf('?') + 1, urldata.indexOf('.html'));
		document.getElementById('search').value = decodeURI(value);
	}
	document.getElementById('kword').innerText = '“' + decodeURI(value) + '”';
	// 获取详细信息
	post('kw=' + value).then(datas => {
		if (datas.code == 1) {
			let data = '';
			datas = datas.data;
			for (let i = 0, len = datas.length; i < len; i++) {
				data += '<a href="../play/?cat=' + datas[i].cat_id + '&vid=' + datas[i].en_id +
					'.html"><i style="background-image:url(' + datas[i].cover +
					')"><b>' + datas[i].cat_name + '</b></i><span>' + datas[i].title + '</span></a>';
			}
			document.getElementById('listList').innerHTML = data;
		} else {
			alert('网络错误！');
		}
	}).catch(e => {
		document.getElementById('listList').innerHTML = '<div class="no-data">没有找到相关影片，请尝试其他关键词！</div>';
		console.error('[404]错误日志：', e);
	})
}
so();
// 回车搜索
window.onkeydown = () => {
	if (window.event && window.event.keyCode == 13 && search == document.activeElement) {
		so();
	}
}