﻿/**
 * 初期表示制御。
 */
let now = new Date();
let month = now.getMonth()+1;
let days = now.getDate();
//ページが読み込まれたときに発火し現在の日付を設定
document.addEventListener("DOMContentLoaded", defaultDate, false);

/**
 * アラーム時間初期化。
 */
let sHour;
let sMinutes;
let timeSetFlg = false;

//1秒ごとに実行
setInterval("alarm()", 1000);

/**
 * 時刻を設定しているときはページを離れる前にアラートを出す。
 */
window.addEventListener("beforeunload", function(e){
    if(timeSetFlg == true){
    	//chrome用
    	e.returnValue = "true";
    	//IE等
    	return "アラームが設定されています。";
    }
}, false);