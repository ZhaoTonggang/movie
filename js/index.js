// 严格模式
"use strict";
// 获取轮播
post('block').then(datas => {
	if (datas.code == 1 && datas.data.length > 0) {
		datas = datas.data;
		let bdata = '',
			adata = '';
		const len = datas.length;
		const imgUrls = [];
		for (let i = 0; i < len; i++) {
			const imgUrl = datas[i].pic_lists[0].url;
			bdata += '<li class="item"><a href="./play/?' + btoa(encodeURI(datas[i].cat + '&' + datas[i]
					.ent_id)) + '.html"><img src="' + imgUrl +
				'" onerror="noimg(event)" alt="' + datas[i].title + '" loading="lazy" /><span>' + datas[i]
				.title + '</span></a></li>';
			adata += '<li class="circle"></li>';
			imgUrls.push(imgUrl);
		}
		document.getElementById('item').innerHTML = bdata;
		document.getElementById('circle').innerHTML = adata;
		const items = document.getElementById('item').children,
			circles = document.getElementById('circle').children,
			rightBtn = document.getElementById("btn-right"),
			lunbo = document.getElementById('lunbo'),
			timeIndicator = document.getElementById('time-indicator'),
			timeProgress = timeIndicator.querySelector('.time-progress'),
			timeText = timeIndicator.querySelector('.time-text'),
			SLIDE_DURATION = 3000,
			/*展示轮播图*/
			move = (e) => {
				for (let i = 0; i < len; i++) {
					if (i == e) {
						items[e].className = "item active";
						circles[e].className = "circle white";
						// 应用模糊背景图到body
						document.body.style.backgroundImage = `url('${imgUrls[e]}')`;
					} else {
						items[i].className = "item";
						circles[i].className = "circle";
						circles[i].setAttribute("num", i);
					}
				}
				// 切换动画方向
				isReverse = !isReverse;
				// 重置时间指示器
				resetTimeIndicator();
			},
			// 重置时间指示器
			resetTimeIndicator = () => {
				remainingTime = SLIDE_DURATION;
				updateTimeIndicator();
			},
			// 更新时间指示器
			updateTimeIndicator = () => {
				// 确保时间不会为负数
				const safeRemainingTime = Math.max(0, remainingTime);
				let progress;
				if (isReverse) {
					// 反向动画：线条增加（从0到100）
					progress = (safeRemainingTime / SLIDE_DURATION) * 100;
				} else {
					// 正向动画：线条减少（从100到0）
					progress = (1 - safeRemainingTime / SLIDE_DURATION) * 100;
				}
				timeProgress.style.strokeDashoffset = progress;
				// 倒计时结束后直接显示3，不显示0
				const displayTime = safeRemainingTime <= 0 ? SLIDE_DURATION / 1000 : Math.ceil(
					safeRemainingTime / 1000);
				timeText.textContent = displayTime;
			};
		let index = 0,
			timer = null,
			timeTimer = null,
			remainingTime = SLIDE_DURATION,
			isPaused = false,
			isReverse = false; // 标记是否为反向动画（线条增加）
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
		const startAutoSlide = () => {
			timer = setInterval(() => {
				rightBtn.onclick();
			}, SLIDE_DURATION);
			// 开始时间进度动画
			timeTimer = setInterval(() => {
				if (!isPaused) {
					remainingTime -= 100;
					updateTimeIndicator();
				}
			}, 100);
		};
		startAutoSlide();
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
			clearInterval(timeTimer);
			isPaused = true;
		}
		//鼠标移出又开启定时器
		lunbo.onmouseleave = () => {
			clearInterval(timer);
			clearInterval(timeTimer);
			isPaused = false;
			startAutoSlide();
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
	// 关闭声明
	endtip = () => document.getElementById('tip').style.display = 'none';
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
(async () => {
	// 开始 Service Worker
	if ('serviceWorker' in navigator) {
		try {
			// 监听SW发送的消息
			navigator.serviceWorker.addEventListener('message', (event) => {
				if (!event.data) return;
				// 缓存更新完成通知
				if (event.data.type === 'CACHE_UPDATED') console.log('✨ PWA缓存已更新为版本:', event.data
					.version);
				// 缓存状态提示（命中/离线）
				if (event.data.type === 'CACHE_STATUS') {
					const {
						status,
						version
					} = event.data, el = document.getElementById('Status');
					if (!el) return;
					const [message, color] = status === 'HIT' ? ['使用缓存加载', '#4caf50'] : status ===
						'MISS' ? ['正在缓存资源', '#60b5ff'] : ['离线模式', '#ff9800'];
					el.style.backgroundColor = color;
					el.textContent = message;
					console.log(message + '，当前数据版本:' + version);
					el.style.display = 'block';
					setTimeout(() => el.style.display = 'none', 5000);
				}
			});
			// 新SW激活后自动刷新页面
			let isFirstInstall = true;
			navigator.serviceWorker.addEventListener('controllerchange', () => {
				if (!isFirstInstall) window.location.reload();
				isFirstInstall = false;
			});
			// 版本更新提示函数
			const showUpdatePrompt = (worker) => {
				alert('🟢 检测到云端数据差异：\n🎉 有新版数据可用，程序即将自动重启！');
				try {
					worker.postMessage('SKIP_WAITING');
				} catch (err) {
					console.error('❌ 发送更新消息失败:', err);
					window.location.reload();
				}
			};
			// 注册Service Worker
			const registration = await navigator.serviceWorker.register('./sw.js', {
				updateViaCache: 'none'
			});
			console.log('✅ Service Worker 注册成功:', registration.scope);
			// 处理已存在的待激活版本
			if (registration.waiting) {
				console.log('🎉 已有新版本等待激活！');
				showUpdatePrompt(registration.waiting);
			}
			// 监听新版本发现
			registration.addEventListener('updatefound', () => {
				const newWorker = registration.installing;
				console.log('🔄 发现新版本！');
				newWorker.addEventListener('statechange', () => {
					if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
						console.log('🎉 新版本已准备好！');
						showUpdatePrompt(newWorker);
					}
				}, {
					once: true
				});
			});
		} catch (error) {
			console.log('❌ Service Worker 注册失败:', error);
		}
	} else {
		console.log('❌ 当前浏览器不支持 Service Worker');
	}
	// 获取最近观看
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