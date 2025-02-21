// 严格模式
"use strict";
// 初始页码
let page = 1;
const lxlist = ['全部', '热血', '科幻', '美少女', '魔幻', '经典', '励志', '少儿', '冒险', '搞笑', '推理', '恋爱', '治愈', '幻想', '校园', '动物', '机战',
	'亲子', '儿歌', '运动', '悬疑', '怪物', '战争', '益智', '青春', '童话', '竞技', '动作', '社会', '友情', '真人版', '电影版', 'OVA版'
];
const ndlist = ['全部', 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2010, 2009,
	2008, 2007, 2006, 2005, 2004, '更早'
];
const dqlist = ['全部', '内地', '中国香港', '中国台湾', '日本', '欧美'];
// 过滤器
const filter = (c) => {
	const filt = {
		'全部': '',
		'内地': '大陆',
		'中国香港': '香港',
		'中国台湾': '台湾'
	};
	return (c in filt) ? filt[c] : c;
}
// radio遍历器
const radio = (r) => {
	const all = document.getElementsByName(r);
	for (let i = 0, len = all.length; i < len; i++) {
		if (all[i].checked) {
			return all[i].value;
		}
	}
}
const getlist = (a, b) => {
	let content = '';
	for (let i = 0, len = b.length; i < len; i++) {
		let chk = (i == 0) ? 'checked' : '';
		let val = (i == 0) ? '' : b[i];
		content += '<input ' + chk + ' type="radio" name="' + a + '" value="' + val + '" id="' + a + i +
			'" onclick="getmov()" /><label for="' + a + i + '">' + b[i] + '</label>';
	}
	document.getElementById(a).innerHTML += content;
}
getlist('lx', lxlist);
getlist('nd', ndlist);
getlist('dq', dqlist);
const getmov = (s) => {
	const pxv = '&rank=' + radio('paixu');
	let lxv = filter(radio('lx')) ? '&cat=' + filter(radio('lx')) : '';
	let ndv = filter(radio('nd')) ? '&year=' + filter(radio('nd')) : '';
	let dqv = filter(radio('dq')) ? '&area=' + filter(radio('dq')) : '';
	let pgv = '';
	if (s == 1) {
		page += 1;
	}
	if (s == 0) {
		page -= 1;
	}
	if (page > 1) {
		pgv = '&pageno=' + page;
		document.getElementById('prev').style.display = '';
	} else {
		pgv = '';
		document.getElementById('prev').style.display = 'none';
	}
	post('catid=4' + pxv + lxv + ndv + dqv + pgv).then(datas => {
		if (datas.code == 1) {
			let data = '';
			datas = datas.data;
			for (let i = 0, len = datas.length; i < len; i++) {
				data += '<a href="../../play/?cat=4&vid=' + encodeURI(datas[i].id) +
					'.html"><i style="background-image:url(https://' + datas[i].cdncover +
					')"><b>更新至' + datas[i].upinfo + '集</b></i><span>' + datas[i].title + '</span></a>';
			}
			document.getElementById('listList').innerHTML = data;
		} else {
			alert('网络错误！');
		}
	}).catch(e => console.error('[404]错误日志：', e))
}
getmov();
// 搜索
const so = () => {
	const value = encodeURI(document.getElementById('search').value.replace(/\s+/g, ''));
	if (value != '') {
		window.open('../../search/?' + value + '.html');
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