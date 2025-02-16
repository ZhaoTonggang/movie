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
	console.log(value);
	// 获取详细信息
	fetch('https://server.heheda.top/movie/', {
		body: 'kw=' + value,
		method: 'POST',
		cache: 'force-cache',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	}).then(response => response.json()).then(datas => {
		if (datas.code == 1) {
			let data = '';
			datas = datas.data;
			for (let i in datas) {
				data += '<a href="../play/?cat=' + datas[i].cat_id + '&vid=' + datas[i].en_id +
					'.html"><i style="background-image:url(' + datas[i].cover +
					')"><b>' + datas[i].cat_name + '</b></i><span>' + datas[i].title + '</span></a>';
			}
			document.getElementById('listList').innerHTML = data + '<span class="clear"></span>';
			document.getElementById('kword').innerText = '“' + decodeURI(value) + '”';
		} else {
			alert('网络错误！');
		}
		console.log(datas)
	}).catch(e => console.error('[404]错误日志：', e))
}
so();
// 回车搜索
window.onkeydown = () => {
	if (window.event && window.event.keyCode == 13 && search == document.activeElement) {
		so();
	}
}