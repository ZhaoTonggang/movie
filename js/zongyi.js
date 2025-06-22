// 严格模式
"use strict";
// 初始页码
let page = 1;
const lxlist = ['全部', '脱口秀', '真人秀', '搞笑', '选秀', '八卦', '访谈', '情感', '生活', '晚会', '音乐', '职场', '美食', '时尚', '游戏', '少儿', '体育',
	'纪实', '科教', '曲艺', '歌舞', '财经', '汽车', '播报', '其他'
];
const dqlist = ['全部', '内地', '中国香港', '中国台湾', '日本', '欧美'];
const mxlist = ['全部', '邓超', '陈赫', '何炅', '汪涵', '王俊凯', '黄磊', '谢娜', '黄渤', '周杰伦', '薛之谦', 'Angelababy', '易烊千玺', '岳云鹏', '王嘉尔',
	'鹿晗', '杨幂', '沈腾', '张艺兴', '潘玮柏', '华晨宇', '李维嘉', '宋小宝', '贾玲', '沙溢', '撒贝宁', '涂磊'
];
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
	for (let i in b) {
		let chk = (i == 0) ? 'checked' : '';
		let val = (i == 0) ? '' : b[i];
		content += '<input ' + chk + ' type="radio" name="' + a + '" value="' + val + '" id="' + a + i +
			'" onclick="getmov()" /><label for="' + a + i + '">' + b[i] + '</label>';
	}
	document.getElementById(a).innerHTML += content;
}
getlist('lx', lxlist);
getlist('dq', dqlist);
getlist('mx', mxlist);
const getmov = (s) => {
	const pxv = '&rank=' + radio('paixu');
	let lxv = filter(radio('lx')) ? '&cat=' + filter(radio('lx')) : '';
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
	post('catid=3' + pxv + lxv + dqv + mxv + pgv).then(datas => {
		if (datas.code == 1) {
			let data = '';
			datas = datas.data;
			for (let i = 0, len = datas.length; i < len; i++) {
				data += '<a href="../../play/?' + btoa(encodeURI('3&' + datas[i].id)) +
					'.html"><i style="background-image:url(https://' + datas[i].cdncover +
					')"><b style="color: #fff;font-size: 0.3rem;text-align: center;">' +
					datas[i].tag + '</b></i><span>' + datas[i].title + '</span></a>';
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