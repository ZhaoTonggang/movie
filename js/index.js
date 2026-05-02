// 严格模式
"use strict";
// 获取轮播
post('block').then(datas => {
	if (datas.code == 1 && datas.data.length > 0) {
		datas = datas.data;
		let bdata = '',
			adata = '';
		const len = datas.length;
		for (let i = 0; i < len; i++) {
			bdata += '<li class="item"><a href="./play/?' + btoa(encodeURI(datas[i].cat + '&' + datas[i]
					.ent_id)) + '.html"><img src="' + datas[i].pic_lists[0].url +
				'" onerror="noimg(event)" alt="' + datas[i].title + '" loading="lazy" /><span>' + datas[i]
				.title + '</span></a></li>';
			adata += '<li class="circle"></li>';
		}
		document.getElementById('item').innerHTML = bdata;
		document.getElementById('circle').innerHTML = adata;
		const items = document.getElementById('item').children,
			circles = document.getElementById('circle').children,
			rightBtn = document.getElementById("btn-right"),
			lunbo = document.getElementById('lunbo'),
			/*展示轮播图*/
			move = (e) => {
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
		let index = 0,
			timer = null;
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
const list = (j, id) => { // 获取首页数据
		post('list', 'cat=' + j).then(datas => {
			if (datas.code == 1 && datas.data.length > 0) {
				datas = datas.data;
				let idata = '';
				const len = datas.length;
				for (let i = 0; i < len; i++) {
					idata += '<a href="./play/?' + btoa(encodeURI(datas[i].cat + '&' + datas[i].ent_id)) +
						'.html"><img src="' + datas[i].cover + '" onerror="noimg(event)" alt="' + datas[i]
						.title + '" loading="lazy" /><span>热度：' + datas[i].pv + '</span><p>' + datas[i].title +
						'</p></a>';
				}
				document.getElementById(id).innerHTML = idata;
			} else {
				alert('网络错误！');
			}
		}).catch(e => console.error('[404]错误日志：', e))
	},
	endtip = () => { // 关闭声明
		document.getElementById('tip').style.display = 'none';
	}
// 并行发起所有请求
Promise.all([
	list(1, 'tuijianList'),
	list(2, 'dianyingList'),
	list(3, 'dianshiList'),
	list(4, 'zongyiList'),
	list(5, 'dongmanList')
]).catch(e => {
	console.error('并行请求异常：', e);
});
// 获取最近观看
(async () => {
	try {
		// 打开数据库
		db = await openDatabase();
		// 执行数据写入操作
		await new Promise((resolve, reject) => {
			const transaction = db.transaction([storeName], "readonly"),
				request = transaction.objectStore(storeName).getAll();
			request.onsuccess = (e) => {
				// 获取数据并按时间倒序排列
				const zjList = document.getElementById("zuijinList"),
					datas = e.target.result.sort((a, b) => b.time - a.time),
					len = datas.length;
				if (len > 0) {
					let idata = '';
					for (let i = 0; i < len; i++) {
						idata += '<a href="./play/?' + datas[i].play + '.html"><img src="' + datas[
								i].img + '" onerror="noimg(event)" alt="' + datas[i].title +
							'" loading="lazy" /><span>' + new Date(datas[i].time).toLocaleString() +
							'</span><p>' + datas[i].title + '</p></a>';
					}
					zjList.innerHTML = idata;
				} else {
					zjList.innerHTML = '<div class="no-data">还没有观看记录哦，快来找找有哪些好看的吧！</div>';
				}
				resolve(true);
			}
			request.onerror = (e) => {
				const error = new Error("数据写入出错: " + e.target.error);
				console.error("读取数据时出错", e.target.error);
				reject(error);
			};
			// 事务完成处理
			transaction.oncomplete = () => console.debug("事务完成");
			transaction.onerror = (e) => console.error("事务出错:", e.target.error);
		});
	} catch (error) {
		console.error("操作失败:", error);
	} finally {
		// 关闭数据库
		if (db) {
			db.close();
			console.debug("数据库已关闭");
		}
	}
})();