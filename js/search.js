// 严格模式
"use strict";
const urldata = window.location.href;
// 初始化页面
if (window.top != window) {
	alert('当您看到这条提示意味着：您所访问的网站正在恶意调用本站资源，本站对偷盗资源的行为0容忍，点击确认跳转正版体验。');
	window.open(urldata, '_self');
} else if (urldata.indexOf('?') > -1 && urldata.indexOf('.html') > -1) {
	// 获取URL参数
	const value = decodeURI(atob(urldata.substring(urldata.indexOf('?') + 1, urldata.indexOf('.html'))));
	// 填充数据
	document.getElementById('search').value = value;
	document.getElementById('kword').innerText = '“' + value + '”';
	// 获取详细信息
	post('kw=' + value).then(datas => {
		if (datas.code == 1) {
			let data = '';
			datas = datas.data;
			for (let i = 0, len = datas.length; i < len; i++) {
				data += '<a href="../play/?' + btoa(encodeURI(datas[i].cat_id + '&' + datas[i].en_id)) +
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
} else {
	alert('请求参数错误，即将返回首页');
	window.open('../', '_self');
}