// 严格模式
"use strict";
let db;
const storeName = "Watched";
// 初始化数据库
const initdb = async () => {
	const request = await window.indexedDB.open("FengYingGe", 1);
	request.onerror = (e) => {
		console.error("数据库初始化失败:", e.target.error);
	};
	request.onsuccess = (e) => {
		db = e.target.result;
		console.debug("数据库初始化成功", e);
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
}
initdb();