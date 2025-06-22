// 严格模式
"use strict";
// 初始页码
let page = 1;
const lxlist = ['全部', '喜剧', '爱情', '动作', '恐怖', '科幻', '剧情', '犯罪', '奇幻', '战争', '悬疑', '动画', '文艺', '纪录', '传记', '歌舞', '古装',
	'历史', '惊悚', '伦理', '其他'
];
const ndlist = ['全部', 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2010, 2009,
	2008, 2007, '更早'
];
const dqlist = ['全部', '内地', '中国香港', '中国台湾', '泰国', '美国', '韩国', '日本', '法国', '英国', '德国', '印度', '其他'];
const mxlist = ['全部', '成龙', '周星驰', '李连杰', '林正英', '吴京', '徐峥', '黄渤', '王宝强', '李小龙', '张国荣', '洪金宝', '姜文', '沈腾', '邓超', '巩俐',
	'马丽', '闫妮', '周冬雨', '刘昊然', '汤唯', '舒淇', '白百何'
];
// 过滤器
const filter = (c) => {
	const filt = {
		'全部': '',
		'内地': '大陆',
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
	post('catid=1' + pxv + lxv + ndv + dqv + mxv + pgv).then(datas => {
		if (datas.code == 1) {
			let data = '';
			datas = datas.data;
			for (let i = 0, len = datas.length; i < len; i++) {
				data += '<a href="../../play/?' + btoa(encodeURI('1&' + datas[i].id)) +
					'.html"><i style="background-image:url(https://' + datas[i].cdncover +
					')"><b style="color: #fff;font-size: 0.3rem;text-align: center;">' +
					datas[i].comment + '</b></i><span>' + datas[i].title + '</span></a>';
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
document.addEventListener('keydown', (e) => {
	if (e.key == 'Enter' && search == document.activeElement) {
		so();
	}
})