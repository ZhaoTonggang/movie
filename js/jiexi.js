// 严格模式
"use strict";
//判断是否为移动设备
let ismobile = window.innerWidth <= 550 ? true : false || false,
	diz, dzz, yzm, xipid, timeout = null;
if (!navigator.share) document.getElementById("fxbz").style.display = "none";
// 载入语音
const title = document.title,
	cdtopbt = document.getElementById("cdtop"),
	cla = document.getElementById("player"),
	dbz = /^(?:http(s)?:\/\/)?[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\*\+,;=.]+$/g,
	gjk = document.getElementById("jk"),
	gdz = document.getElementById("url"),
	// xtip 弹窗组件实现 
	xtip = {
		instances: [],
		dragState: null,
		zIndexBase: 10000,
		open: (options) => {
			const config = {
				type: options.type || 'h',
				content: options.content || '',
				title: options.title !== false ? (options.title || '提示') : false,
				width: options.width || '500px',
				height: options.height || '400px',
				shade: options.type === 'u' ? false : (options.shade !== false),
				closeBtn: options.closeBtn !== false
			};
			// 只有非u类型弹窗才会关闭其他弹窗
			const id = Date.now() + Math.random(),
				currentZIndex = xtip.zIndexBase + xtip.instances.length;
			let html = '';
			if (config.shade) html +=
				`<div class="xtip-shade" id="xtip-shade-${id}" style="position:fixed;top:0;left:0;width:100%;height:100%;background:rgba(0,0,0,0.8);z-index:${currentZIndex - 1};"></div>`;
			if (config.type === 'u') {
				html +=
					`<div class="xtip-box" id="xtip-box-${id}" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:${config.width};height:${config.height};background:#fff;border:1px solid #ddd;z-index:${currentZIndex};display:flex;flex-direction:column;box-shadow:0 4px 12px rgba(0,0,0,0.3);transition: none;">`;
			} else {
				html +=
					`<div class="xtip-box" id="xtip-box-${id}" style="position:fixed;top:50%;left:50%;transform:translate(-50%,-50%);width:${config.width};max-height:90vh;background:#fff;border:1px solid #ddd;z-index:${currentZIndex};display:flex;flex-direction:column;">`;
			}
			if (config.title) {
				if (config.type === 'u') {
					html +=
						`<div class="xtip-header" id="xtip-header-${id}" style="padding:10px 15px;background:#f5f5f5;border-bottom:1px solid #ddd;display:flex;justify-content:space-between;align-items:center;cursor:move;user-select:none;">`;
				} else {
					html +=
						`<div class="xtip-header" style="padding:10px 15px;background:#f5f5f5;border-bottom:1px solid #ddd;display:flex;justify-content:space-between;align-items:center;">`;
				}
				html += `<span class="xtip-title" style="font-weight:bold;">${config.title}</span>`;
				if (config.closeBtn) html +=
					`<span class="xtip-close" id="xtip-close-${id}" style="cursor:pointer;font-size:20px;line-height:1;color:#666;">×</span>`;
				html += '</div>';
			}
			if (config.type === 'u') {
				html += '<div class="xtip-body" style="flex:1;overflow:hidden;">';
			} else {
				html += '<div class="xtip-body">';
			}
			if (config.type === 'u') {
				html +=
					`<iframe src="${config.content}" style="width:100%;height:100%;border:none;display:block;" allow="fullscreen;autoplay" sandbox="allow-scripts allow-same-origin" loading='lazy'></iframe>`;
			} else {
				html += config.content;
			}
			html += '</div></div>';
			const div = document.createElement('div');
			div.innerHTML = html;
			document.body.appendChild(div);
			// 保存实例信息
			xtip.instances.push({
				id: id,
				type: config.type,
			});
			if (config.closeBtn) {
				const closeBtn = document.getElementById(`xtip-close-${id}`);
				if (closeBtn) closeBtn.onclick = () => xtip.close(id);
			}
			// 为type=u的弹窗添加拖动功能
			if (config.type === 'u') {
				const header = document.getElementById(`xtip-header-${id}`),
					box = document.getElementById(`xtip-box-${id}`);
				if (header && box) {
					header.onmousedown = (e) => {
						// 点击时将该弹窗移到最上层
						xtip.bringToFront(id);
						const rect = box.getBoundingClientRect();
						xtip.dragState = {
							id: id,
							startX: e.clientX,
							startY: e.clientY,
							startLeft: rect.left,
							startTop: rect.top
						};
						document.onmousemove = (e) => {
							if (xtip.dragState && xtip.dragState.id === id) {
								const dx = e.clientX - xtip.dragState.startX;
								const dy = e.clientY - xtip.dragState.startY;
								box.style.left = `${xtip.dragState.startLeft + dx}px`;
								box.style.top = `${xtip.dragState.startTop + dy}px`;
								box.style.transform = 'none';
							}
						};
						document.onmouseup = () => {
							document.onmousemove = null;
							document.onmouseup = null;
							xtip.dragState = null;
						};
					};
					// 点击弹窗内容时也移到最上层
					box.onmousedown = (e) => {
						if (e.target === box || e.target.closest('.xtip-header')) xtip.bringToFront(id);
					};
				}
			}
			return id;
		},
		// 关闭指定弹窗
		close: (id) => {
			const instanceIndex = xtip.instances.findIndex(inst => inst.id === id);
			if (instanceIndex === -1) return;
			// 移除遮罩
			const shade = document.getElementById(`xtip-shade-${id}`);
			if (shade) shade.parentNode.removeChild(shade);
			// 移除弹窗
			const box = document.getElementById(`xtip-box-${id}`);
			if (box) box.parentNode.removeChild(box);
			// 从数组中移除
			xtip.instances.splice(instanceIndex, 1);
		},
		// 将指定弹窗移到最上层
		bringToFront: (id) => {
			const instanceIndex = xtip.instances.findIndex(inst => inst.id === id);
			if (instanceIndex === -1) return;
			// 重新计算所有弹窗的z-index
			xtip.instances.forEach((inst, index) => {
				const box = document.getElementById(`xtip-box-${inst.id}`),
					shade = document.getElementById(`xtip-shade-${inst.id}`),
					zIndex = xtip.zIndexBase + index;
				if (box) box.style.zIndex = zIndex;
				if (shade) shade.style.zIndex = zIndex - 1;
			});
			// 将目标弹窗移到数组末尾（最后渲染，z-index最高）
			const instance = xtip.instances.splice(instanceIndex, 1)[0];
			xtip.instances.push(instance);
			// 重新设置z-index
			xtip.instances.forEach((inst, index) => {
				const box = document.getElementById(`xtip-box-${inst.id}`),
					shade = document.getElementById(`xtip-shade-${inst.id}`),
					zIndex = xtip.zIndexBase + index;
				if (box) box.style.zIndex = zIndex;
				if (shade) shade.style.zIndex = zIndex - 1;
			});
		}
	},
	// 功能
	play = (a) => {
		let jko = gjk.selectedIndex,
			jkv = decodeURI(atob(gjk.options[jko].value));
		if (a === 0) {
			dzz = gdz.value;
			diz = dzz.replace(/[\u4E00-\u9FA5]|(^\s*)|(\s*$)/g, '');
			const daz = document.getElementById("ksbf"),
				dck = document.getElementById("ckbf");
			if (dbz.test(diz)) {
				daz.style.display = "block";
				dck.style.display = "block";
			}
		} else if (a === 1) {
			let url = diz.indexOf("?"),
				mgurl = diz.indexOf("migu");
			if (mgurl != -1) {
				let migu = diz.indexOf("&");
				if (migu != -1) {
					diz = diz.substring(0, migu);
				}
			} else {
				if (url != -1) {
					diz = diz.substring(0, url);
				}
			}
			document.getElementById("url").value = diz;
			document.getElementById("player").src = jkv + diz;
		} else if (a === 2) {
			let url = diz.indexOf("?"),
				mgurl = diz.indexOf("migu");
			if (mgurl != -1) {
				let migu = diz.indexOf("&");
				if (migu != -1) {
					diz = diz.substring(0, migu);
				}
			} else {
				if (url != -1) {
					diz = diz.substring(0, url);
				}
			}
			document.getElementById("url").value = diz;
			xtip.open({
				type: 'u',
				content: jkv + diz,
				title: '窗口播放',
				width: ismobile ? '90%' : '850px',
				height: ismobile ? '50%' : '500px'
			});
		}
	},
	//赞赏码
	othbta = () => {
		xtip.open({
			type: 'h',
			width: ismobile ? '300px' : '500px',
			height: ismobile ? '300px' : '500px',
			content: '<img alt="赞赏码" src="../images/zsm.jpg" style="width:100%;height:auto;display:block;">'
		});
	},
	//分享功能
	othbts = () => {
		navigator.share({
			title: title,
			url: window.location.href,
			text: '全网视频免费看，宅男必备！'
		});
	},
	// 下载APP
	dapp = () => {
		xtip.open({
			type: 'h',
			width: ismobile ? '90%' : '55%',
			height: '120px',
			content: '<div style="padding:5px"><button type="button" onclick="othbut(30)" class="btn btn-success btn-lg btn-block">#安卓版本#</button><button type="button" onclick="xzapp-ios()" class="btn btn-success btn-lg btn-block" disabled>#IOS版本#</button></div>',
			title: false
		});
	},
	//返回顶部
	cdTop2 = () => {
		window.scrollY = 0;
		document.documentElement.scrollTop = 0;
	};
// 网站标题自动判断
window.addEventListener('visibilitychange', () => {
	if (document.hidden) {
		document.title = '(つ ェ ⊂)我藏好了哦~';
	} else {
		document.title = '(*゜ロ゜)ノ被发现了~';
		setTimeout(() => {
			document.title = title;
		}, 3000);
	}
});
// 监听屏幕滚动
window.addEventListener('scroll', () => {
	if (timeout !== null) clearTimeout(timeout);
	timeout = setTimeout(() => {
		let scrollTop = window.scrollY || document.documentElement.scrollTop;
		if (scrollTop > 100) {
			cdtopbt.className = "cdtopVis";
			if (scrollTop > 400) cla.classList.add("player-fix");
		} else {
			cdtopbt.className = "cdtopHid";
			cla.classList.remove("player-fix");
		}
	}, 500);
});