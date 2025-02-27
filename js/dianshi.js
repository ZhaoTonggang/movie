// 严格模式
"use strict";
// 初始页码
let page = 1;
const lxlist = ['全部', '言情', '剧情', '伦理', '喜剧', '悬疑', '都市', '偶像', '古装', '军事', '警匪', '历史', '励志', '神话', '谍战', '青春', '家庭',
	'动作', '情景', '武侠', '科幻', '其他'
];
const ndlist = ['全部', 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2010, 2009,
	2008, 2007, '更早'
];
const dqlist = ['全部', '内地', '中国香港', '中国台湾', '泰国', '日本', '韩国', '美国', '英国', '新加坡'];
const mxlist = ['全部', '杨幂', '热巴', '张嘉译', '赵丽颖', '赵又廷', '胡歌', '孙俪', '韩东君', '周迅', '张一山', '李小璐', '李沁', '陈坤', '刘亦菲', '唐嫣',
	'李小冉', '周冬雨', '于和伟', '李易峰', '雷佳音', '何冰', '阮经天', '梅婷', '徐峥', '祖峰', '秦海璐', '杨紫', '任嘉伦', '贾乃亮', '罗晋'
];
// 过滤器
const filter = (c) => {
	const filt = {
		'全部': '',
		'更早': 'lt_year',
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
getlist('mx', mxlist);
const getmov = (s) => {
	const pxv = '&rank=' + radio('paixu');
	let lxv = filter(radio('lx')) ? '&cat=' + filter(radio('lx')) : '';
	let ndv = filter(radio('nd')) ? '&year=' + filter(radio('nd')) : '';
	let dqv = filter(radio('dq')) ? '&area=' + filter(radio('dq')) : '';
	let mxv = filter(radio('mx')) ? '&act=' + filter(radio('mx')) : '';
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
	post('catid=2' + pxv + lxv + ndv + dqv + mxv + pgv).then(datas => {
		if (datas.code == 1) {
			let data = '';
			datas = datas.data;
			for (let i = 0, len = datas.length; i < len; i++) {
				data += '<a href="../../play/?cat=2&vid=' + encodeURI(datas[i].id) +
					'.html"><i style="background-image:url(https://' + datas[i].cdncover + ')"><b>更新至' +
					datas[i].upinfo + '集</b></i><span>' + datas[i].title + '</span></a>';
			}
			document.getElementById('listList').innerHTML = data;
		} else {
			alert('网络错误');
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
document.addEventListener('keydown', (e) => {
	if (e.key == 'Enter' && search == document.activeElement) {
		so();
	}
})