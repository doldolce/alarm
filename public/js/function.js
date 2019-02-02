/**
 * 現在の日付を設定。
 */
function defaultDate(){
	let monthOption = document.getElementById('month');
	let daysOption = document.getElementById('days');
	pulldownSelect(monthOption,month);
	pulldownSelect(daysOption,days);
}

/**
 * プルダウンデフォルト制御 
 * @param {HTMLElement} optionElem 
 * @param {Number} dateValue 
 */
function pulldownSelect(optionElem,dateValue){
	for(i=0;i<optionElem.length;i++){
		if(optionElem.options[i].value == dateValue){
			optionElem[i].selected = true;
			break;
		}
	}
}

/**
 * 「時間設定」ボタン押下。
 */
function timeSet(){
	sHour = document.getElementById('hour').value;
	sMinutes = document.getElementById('minutes').value;
	
	let confirmation = returnRemainingDate();
	
	if(sHour == '' || sMinutes == ''){
	//「-」が選択されている場合。
		alert("時間を設定して下さい。");
	}else if(confirmation < 0){
	// 過去の日時が設定されている場合。
		alert("現在時刻よりも先の時間を設定して下さい。")
	}else{
	// 正しく時間を設定した場合。
		timeSetFlg = true;
		let timer = document.getElementById('timer');
		$('#timer').fadeIn(1300);
		// カウント中に設定時間を弄れないようにする。
		$('#month,#days,#hour,#minutes').prop('disabled', true);
	}
}

/**
 * 「設定しなおす」ボタン押下。
 */
function timeReset(){
	sHour = '';
	sMinutes = '';
	document.setForm.reset();
	timeSetFlg = false;
	let timer = document.getElementById('timer');
	defaultDate();
	
	// タイトルリセット。
	document.title = 'アラーム';
	
	// タイマーリセット
	$('#timer').fadeOut(500);
	timer.innerHTML = 'あと<span id="remainingHours"></span>時間<span id="remainingMinutes"></span>分<span id="remainingSeconds"></span>秒';
	$('#month,#days,#hour,#minutes').prop('disabled', false);
}

/**
 * アラーム処理。
 */
function alarm(){
  if(timeSetFlg == true){
	  let remainingDate = returnRemainingDate();
	  
	if (remainingDate >= 0){
	// 残り時間が0以上の場合。
	  	// 残りの日時を1hで割った時間と、分・秒を取得。
	    let rHours = Math.floor(remainingDate / 3600000);
	    let rMinutes = Math.floor((remainingDate - rHours * 3600000) / 60000);
	    let rSeconds = Math.round((remainingDate - rHours * 3600000 - rMinutes * 60000) / 1000);
		  
		// ゼロ埋め。
	    let rHoursStr = zeroPaddingH(String(rHours));
	    let rMinutesStr = zeroPaddingMS(String(rMinutes));
	    let rSecondsStr = zeroPaddingMS(String(rSeconds));
	      
	    let zanHoursElem = document.getElementById('remainingHours');
		let zanMinutesElem = document.getElementById('remainingMinutes');
		let zanSecondsElem = document.getElementById('remainingSeconds');
		
		// 残り時間を表示する。
	    zanHoursElem.innerHTML = rHoursStr;
		zanMinutesElem.innerHTML = rMinutesStr;
		zanSecondsElem.innerHTML = rSecondsStr;
		  
		// タイトルを動的に変更("アラーム"⇒hh:mm:ss)。
		document.title = rHoursStr+':'+rMinutesStr+':'+rSecondsStr;
	} else {
		// 時間になったらプッシュ通知でお知らせ。
		Push.create("アラーム", {
			body: "時間になりました！",
			icon: '/public/img/notification_icon.png',
			// 通知があったら暫く消えないようにしたいのでとりあえず1時間に設定。
			timeout: 3600000
		});
		timer.innerHTML = "時間になりました！";
		document.title = "時間になりました！";
		timeSetFlg = false;
	}
  }  
}

/**
 * ゼロ埋め処理(分・秒)。
 * @param {String} time ゼロ埋め対象。
 */
function zeroPaddingMS(time){
	if(time.length < 2){
	//一桁の場合ゼロ埋めを行う
    	time = '0' + time;
    }else if(time == '60'){
    //60は00と表記する
    	time = '00';
    }
    return time;
}

/**
 * ゼロ埋め処理(時)。
 * @param {String} time ゼロ埋め対象。
 */
function zeroPaddingH(time){
	if(time.length < 2){
	//一桁の場合ゼロ埋めを行う
    	time = '0' + time;
    }
    return time;
}

/**
 * 残り時間の取得。
 */
function returnRemainingDate(){
	let now = new Date();
	let sMonth = document.getElementById('month').value;
	let sDays = document.getElementById('days').value;
	let targetDate = new Date(now.getFullYear()+'-'+sMonth+'-'+sDays+'T'+sHour+':'+sMinutes+':00+09:00');
	// 経過日時を1日のミリ秒で割る。
	let daysBetween = Math.ceil((targetDate - now) / (24*60*60*1000));
	// 設定時刻 - 現在時刻 で残り時間を算出。
	let remainingDate = (targetDate - now);

	return remainingDate;
}


