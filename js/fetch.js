// 严格模式
"use strict";
let timeout = null;
const cdtopbt = document.getElementById('scrollToTop');
// 封装POST
const post = async (data = '') => {
	const response = await fetch('https://server.heheda.top/movie/', {
		body: data,
		method: 'POST',
		cache: 'force-cache',
		headers: {
			'Content-Type': 'application/x-www-form-urlencoded'
		}
	});
	if (response.ok) {
		return response.json();
	} else {
		throw new Error(response.statusText);
	}
}
//返回顶部
const cdTop = () => {
	document.documentElement.scrollTop = 0;
	document.body.scrollTop = 0;
}
// 监听屏幕滚动
window.addEventListener('scroll', () => {
	if (timeout !== null) {
		clearTimeout(timeout);
	}
	timeout = setTimeout(() => {
		let scrollTop = document.documentElement.scrollTop || document.body.scrollTop;
		// 返回顶部
		if (scrollTop > 100) {
			cdtopbt.style.display = "block";
		} else {
			cdtopbt.style.display = "none";
		};
	}, 500);
})