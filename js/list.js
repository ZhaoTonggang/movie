// 严格模式
"use strict";
// 初始页码
let page = 1,
	getId, urlId, tegId;
const urldata = window.location.href;
// 分类配置
const Config = {
	dianying: {
		e: '电影',
		i: 1,
		l: ['全部', '喜剧', '爱情', '动作', '恐怖', '科幻', '剧情', '犯罪', '奇幻', '战争', '悬疑', '动画', '文艺', '纪录', '传记', '歌舞',
			'古装', '历史', '惊悚', '伦理', '其他'
		],
		n: ['全部', 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2010,
			2009, 2008, 2007, '更早'
		],
		d: ['全部', '内地', '中国香港', '中国台湾', '泰国', '美国', '韩国', '日本', '法国', '英国', '德国', '印度', '其他'],
		m: ['全部', '成龙', '周星驰', '李连杰', '林正英', '吴京', '徐峥', '黄渤', '王宝强', '李小龙', '张国荣', '洪金宝', '姜文', '沈腾', '邓超',
			'巩俐', '马丽', '闫妮', '周冬雨', '刘昊然', '汤唯', '舒淇', '白百何'
		]
	},
	dianshi: {
		e: '电视剧',
		i: 2,
		l: ['全部', '言情', '剧情', '伦理', '喜剧', '悬疑', '都市', '偶像', '古装', '军事', '警匪', '历史', '励志', '神话', '谍战', '青春',
			'家庭', '动作', '情景', '武侠', '科幻', '其他'
		],
		n: ['全部', 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2010,
			2009, 2008, 2007, '更早'
		],
		d: ['全部', '内地', '中国香港', '中国台湾', '泰国', '日本', '韩国', '美国', '英国', '新加坡'],
		m: ['全部', '杨幂', '热巴', '张嘉译', '赵丽颖', '赵又廷', '胡歌', '孙俪', '韩东君', '周迅', '张一山', '李小璐', '李沁', '陈坤', '刘亦菲',
			'唐嫣', '李小冉', '周冬雨', '于和伟', '李易峰', '雷佳音', '何冰', '阮经天', '梅婷', '徐峥', '祖峰', '秦海璐', '杨紫', '任嘉伦', '贾乃亮',
			'罗晋'
		]
	},
	zongyi: {
		e: '综艺',
		i: 3,
		l: ['全部', '脱口秀', '真人秀', '搞笑', '选秀', '八卦', '访谈', '情感', '生活', '晚会', '音乐', '职场', '美食', '时尚', '游戏', '少儿',
			'体育', '纪实', '科教', '曲艺', '歌舞', '财经', '汽车', '播报', '其他'
		],
		d: ['全部', '内地', '中国香港', '中国台湾', '日本', '欧美'],
		m: ['全部', '邓超', '陈赫', '何炅', '汪涵', '王俊凯', '黄磊', '谢娜', '黄渤', '周杰伦', '薛之谦', 'Angelababy', '易烊千玺', '岳云鹏',
			'王嘉尔', '鹿晗', '杨幂', '沈腾', '张艺兴', '潘玮柏', '华晨宇', '李维嘉', '宋小宝', '贾玲', '沙溢', '撒贝宁', '涂磊'
		]
	},
	dongman: {
		e: '动漫',
		i: 4,
		l: ['全部', '热血', '科幻', '美少女', '魔幻', '经典', '励志', '少儿', '冒险', '搞笑', '推理', '恋爱', '治愈', '幻想', '校园', '动物',
			'机战', '亲子', '儿歌', '运动', '悬疑', '怪物', '战争', '益智', '青春', '童话', '竞技', '动作', '社会', '友情', '真人版', '电影版',
			'OVA版'
		],
		n: ['全部', 2025, 2024, 2023, 2022, 2021, 2020, 2019, 2018, 2017, 2016, 2015, 2014, 2013, 2012, 2010,
			2009, 2008, 2007, 2006, 2005, 2004, '更早'
		],
		d: ['全部', '内地', '中国香港', '中国台湾', '日本', '欧美']
	}
};
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
// 生成筛选列表
const getlist = (a, b) => {
	if (a) {
		const nav = document.getElementById(a);
		if (b) {
			nav.style.display = '';
			let content = '';
			for (let i = 0, len = b.length; i < len; i++) {
				let chk = (i == 0) ? 'checked' : '';
				let val = (i == 0) ? '' : b[i];
				content += '<input ' + chk + ' type="radio" name="' + a + '" value="' + val + '" id="' + a + i +
					'" onclick="getmov()" /><label for="' + a + i + '">' + b[i] + '</label>';
			}
			nav.innerHTML += content;
		} else {
			nav.style.display = 'none';
		}
	} else {
		alert("获取标签失败！");
	}
}
// 获取内容列表
const getmov = (s) => {
	const listList = document.getElementById('listList');
	listList.innerHTML =
		'<div class="s-loading"><i class="first"></i><i class="second"></i><i class="third"></i></div>';
	const pxv = '&rank=' + radio('paixu');
	let lxv = tegId.l ? '&cat=' + filter(radio('lx')) : '';
	let ndv = tegId.n ? '&year=' + filter(radio('nd')) : '';
	let dqv = tegId.d ? '&area=' + filter(radio('dq')) : '';
	let mxv = tegId.m ? '&act=' + filter(radio('mx')) : '';
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
	post('catid=' + urlId + pxv + lxv + ndv + dqv + mxv + pgv).then(datas => {
		if (datas.code == 1) {
			let data = '';
			datas = datas.data;
			for (let i = 0, len = datas.length; i < len; i++) {
				// 根据不同分类显示不同的标签
				let tagContent = '';
				if (urlId == '1') {
					// 电影显示评分
					tagContent = '<b style="color: #fff;font-size: 0.3rem;text-align: center;">' + datas[i]
						.comment + '</b>';
				} else if (urlId == '3') {
					// 综艺显示标签
					tagContent = '<b style="color: #fff;font-size: 0.3rem;text-align: center;">' + datas[i]
						.tag + '</b>';
				} else {
					// 电视剧和动漫显示更新信息
					tagContent = '<b>更新至' + datas[i].upinfo + '集</b>';
				}
				data += '<a href="../play/?' + btoa(encodeURI(urlId + '&' + datas[i].id)) +
					'.html"><i style="background-image:url(https://' + datas[i].cdncover +
					')">' + tagContent + '</i><span>' + datas[i].title + '</span></a>';
			}
			listList.innerHTML = data;
		} else {
			alert('网络错误！');
		}
	}).catch(e => console.error('[404]错误日志：', e));
}
// 初始化页面
if (window.top != window) {
	alert('当您看到这条提示意味着：您所访问的网站正在恶意调用本站资源，本站对偷盗资源的行为0容忍，点击确认跳转正版体验。');
	window.open(urldata, '_self');
} else if (urldata.indexOf('?') > -1 && urldata.indexOf('.html') > -1) {
	// 获取URL参数
	getId = urldata.substring(urldata.indexOf('?') + 1, urldata.indexOf('.html'));
	// 当前分类ID
	tegId = Config[getId];
	// 获取ID
	urlId = tegId.i;
	// 更新页面标题
	document.title = tegId.e + ' - 风影阁';
	// 选中状态
	document.getElementById(getId).className = "current";
	// 初始化筛选器
	// 类型
	getlist('lx', tegId.l);
	// 年代
	getlist('nd', tegId.n);
	// 地区
	getlist('dq', tegId.d);
	// 明星
	getlist('mx', tegId.m);
	// 获取内容
	getmov();
} else {
	alert('请求参数错误，即将返回首页');
	window.open('../', '_self');
}