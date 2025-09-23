// 严格模式
"use strict";
let db;
const storeName = "Watched";
// 初始化数据库
const openDatabase = () => {
	return new Promise((resolve, reject) => {
		const request = window.indexedDB.open("FengYingGe", 1);
		request.onerror = (e) => {
			reject(new Error("数据库初始化失败: " + e.target.error));
		};
		request.onsuccess = (e) => {
			console.debug("数据库初始化成功");
			resolve(e.target.result);
		};
		request.onupgradeneeded = (e) => {
			db = e.target.result;
			if (!db.objectStoreNames.contains(storeName)) {
				const store = db.createObjectStore(storeName, {
					keyPath: "play"
				});
				store.createIndex("title", "title", {
					unique: false
				});
				store.createIndex("img", "img", {
					unique: false
				});
				store.createIndex("time", "time", {
					unique: false
				});
			}
		};
	});
};