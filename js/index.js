// 严格模式
"use strict";
// 获取轮播
post().then(datas => {
	if (datas.code == 1 && datas.data.length > 0) {
		datas = datas.data;
		let bdata = '';
		let adata = '';
		const len = datas.length;
		for (let i = 0; i < len; i++) {
			bdata += '<li class="item"><a href="./play/?cat=' + datas[i].cat + '&vid=' +
				encodeURI(datas[i].ent_id) + '.html"><i style="background-image:url(' + datas[i].pic_lists[0]
				.url + '"></i><span>' + datas[i].title + '</span></a></li>';
			adata += '<li class="circle"></li>';
		}
		document.getElementById('item').innerHTML = bdata;
		document.getElementById('circle').innerHTML = adata;
		const items = document.getElementById('item').children;
		const circles = document.getElementById('circle').children;
		const rightBtn = document.getElementById("btn-right");
		const lunbo = document.getElementById('lunbo');
		let index = 0;
		let timer = null;
		/*展示轮播图*/
		const move = (e) => {
			for (let i = 0; i < len; i++) {
				if (i == e) {
					items[e].className = "item active";
					circles[e].className = "circle white";
				} else {
					items[i].className = "item";
					circles[i].className = "circle";
					circles[i].setAttribute("num", i);
				}
			}

		}
		//点击右边按钮切换下一张图片
		rightBtn.onclick = () => {
			index = (index + 1) % len;
			move(index);
		};
		//点击左边按钮切换上一张图片
		document.getElementById("btn-left").onclick = () => {
			index = (index - 1 + len) % len;
			move(index);
		};
		//开始定时器，点击右边按钮，实现轮播
		timer = setInterval(() => {
			rightBtn.onclick();
		}, 3000)
		//点击圆点时，跳转到对应图片
		for (let i = 0; i < len; i++) {
			circles[i].onclick = function() {
				index = this.getAttribute("num");
				move(index);
			}
		}
		//鼠标移入清除定时器，并开启一个三秒的定时器，使慢慢转动
		lunbo.onmouseover = () => {
			clearInterval(timer);
		}
		//鼠标移出又开启定时器
		lunbo.onmouseleave = () => {
			clearInterval(timer);
			timer = setInterval(() => {
				rightBtn.onclick();
			}, 3000)
		}
		//初始化轮播图，使页面加载完成后立即显示第一张图片和对应的圆点状态
		move(index);


	} else {
		alert('网络错误！');
	}
}).catch(e => console.error('[404]错误日志：', e));
// 获取首页数据
const list = (j, id) => {
	post('cat=' + j).then(datas => {
		if (datas.code == 1 && datas.data.length > 0) {
			let idata = '';
			datas = datas.data;
			for (let i = 0, len = datas.length; i < len; i++) {
				idata += '<a href="./play/?cat=' + datas[i].cat + '&vid=' + encodeURI(datas[
						i].ent_id) + '.html"><i style="background-image:url(' + datas[i].cover +
					')"><b>' + datas[i].pv + '</b></i><span>' + datas[i].title + '</span></a>';
			}
			document.getElementById(id).innerHTML = idata;
		} else {
			alert('网络错误！');
		}
	}).catch(e => console.error('[404]错误日志：', e))
}
list(2, 'dianyingList');
list(3, 'dianshiList');
list(4, 'zongyiList');
list(5, 'dongmanList');
// 搜索
const so = () => {
	const value = encodeURI(document.getElementById('search').value.replace(/\s+/g, ''));
	if (value != '') {
		window.open('./search/?' + value + '.html');
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
// 关闭声明
const endtip = () => {
	document.getElementById('tip').style.display = 'none';
}