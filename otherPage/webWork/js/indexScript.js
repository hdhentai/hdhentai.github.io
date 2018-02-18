/*測試用JavaScript*/

window.onload = function () {
	//******************************本作用域定義變量*********************************************
	var n_bgimg_max = 5; //定義背景最大個數
	var n_bgimg_now = 1; //當前背景號1~n_bgimg_max
	var timer_menulist; //主Menu收起時鐘
	var n_iframe_state = 0; //浮動框架狀態：0-menu/1-1/../5-5/6-tips
	var n_iframe_state_temp = 0; //暫存浮動框架狀態：6-tips???
	//******************************************************************************************
	//******************************所有需要獲取的對象*******************************************
	//******************************************************************************************
	var img_bgimg = document.getElementById("bgimg_img");
	var img_bgimg_next = document.getElementById("bgimg_next_img");
	//******************************************************************************************
	var div_menu = document.getElementById("index_menu_div");
	var div_menu_bg = document.getElementById("index_menu_bg_div");
	//******************************************************************************************
	var div_Mtips = document.getElementById("index_tips_div");
	var div_Mli = new Array();
	for (var i = 0; i < 6; i++) {
		div_Mli[i] = document.getElementById("index_Mli" + i + "_div");
	}
	div_Mli[6] = document.getElementById("index_Mli6_div");
	//******************************************************************************************
	var div_imgtab = document.getElementById("index_imgtab_div");
	var ul_imgtab = document.getElementById("index_imgtab_ul");
	var div_li_ul_imgtab0 = document.getElementById("index_ImgTabli0_div");
	//******************************************************************************************
	var div_index_iframe = document.getElementById("index_iframe_div");
	var iframe_index = document.getElementById("index_iframe");
	var div_img_leftbottom_jump = document.getElementById("index_BGleftbottom__div");
	var div_blackbase = document.getElementById("index_blackbase_div");
	//******************************************************************************************
	//******************************起始執行操作*************************************************
	//******************************************************************************************
	//設置背景輪換時鐘
	var timer_bgimg = startBGImgTimer();
	//添加BGTabsNode
	addBGTabsNode();
	//定位iframe層
	div_index_iframe.style.left = (parseInt(parseFloat(getComputedStyle(div_index_iframe.parentElement, null).width), 10)) + 'px';
	//******************************************************************************************
	//設置起始背景圖片
	img_bgimg.src = 'img/index_background1.jpg';
	img_bgimg_next.src = 'img/index_background2.jpg';
	document.getElementById("index_ImgTabli0_div").style.backgroundColor = "#000";
	//******************************************************************************************

	//******************************************************************************************
	//******************************事件綁定****************************************************
	//******************************************************************************************
	//定義方法：設置背景輪換時鐘
	function startBGImgTimer() {
		return setInterval(function () {
			toWitchBGImg(n_bgimg_now == n_bgimg_max ? 1 : n_bgimg_now + 1);
		}, 5000);
	}

	//定義方法：背景切換
	function toWitchBGImg(end) {
		var next = 0;
		if (n_bgimg_now == end) {
			return;
		} else if (n_bgimg_now < end) {
			if ((n_bgimg_max - end + n_bgimg_now) < (end - n_bgimg_now)) {
				next = n_bgimg_now == 1 ? n_bgimg_max : n_bgimg_now - 1;
			} else {
				next = n_bgimg_now == n_bgimg_max ? 1 : n_bgimg_now + 1;
			}

		} else if (n_bgimg_now > end) {
			if ((n_bgimg_max - n_bgimg_now + end) < (n_bgimg_now - end)) {
				next = n_bgimg_now == n_bgimg_max ? 1 : n_bgimg_now + 1;
			} else {
				next = n_bgimg_now == 1 ? n_bgimg_max : n_bgimg_now - 1;
			}
		}
		img_bgimg_next.src = 'img/index_background' + next + '.jpg';
		console.log('toWitchBGImg:' + end + '*' + 'next:' + next);
		/*切換Tab*/
		document.getElementById("index_ImgTabli" + (next - 1) + "_div").style.backgroundColor = "#000";
		console.log('toblack:' + (next - 1));
		document.getElementById("index_ImgTabli" + (n_bgimg_now - 1) + "_div").style.backgroundColor = "snow";
		console.log('tosnow:' + (n_bgimg_now - 1));
		//更新當前背景標記
		n_bgimg_now = next;
		/*過渡*/
		changeStyle(
			img_bgimg,
			'opacity',
			0,
			16,
			function () {
				//重置
				img_bgimg.src = 'img/index_background' + n_bgimg_now + '.jpg';
				img_bgimg.style.opacity = 1;
				//啟用下次切換
				setTimeout(function () {
					toWitchBGImg(end);
				}, 1);
				console.log('AchangeEnd_n_bgimg_now:' + n_bgimg_now + '*' + 'end:' + end);
			}
		);
	} //function toWitchBGImg//背景切換方法

	//定義方法：添加背景圖片TabsNode
	//同時綁定事件：Tabs觸發***********************************************************
	function addBGTabsNode() {
		//依據圖片數添加控制節點
		for (var i = 1; i < n_bgimg_max; i++) {
			var newli0 = document.createElement("li");
			var newli1 = document.createElement("li");
			var newlidiv = document.createElement("div");
			newlidiv.id = "index_ImgTabli" + i + "_div";
			newli1.appendChild(newlidiv);
			ul_imgtab.appendChild(newli0);
			ul_imgtab.appendChild(newli1);
			newlidiv.onmouseover = function () {
				var towitchimg = i + 1;
				return function () {
					clearInterval(timer_bgimg);
					toWitchBGImg(towitchimg);
				}
			}();
			newlidiv.onmouseout = function () {
				clearInterval(timer_bgimg);
				timer_bgimg = startBGImgTimer();
			}
		}
		//調整tabs列表寬度
		ul_imgtab.style.width = (2 * n_bgimg_max - 1) * 32 + 'px';
	}

	//定義方法：設置iframe尺寸位置
	//定義到window方法中方便調用***********************************************************
	this.outFunction_setIndexIframeDivSize = function () {
		div_index_iframe.style.width = (parseInt(parseFloat(getComputedStyle(div_index_iframe.parentElement, null).width), 10) - 245) + 'px';
		div_index_iframe.style.height = (parseInt(parseFloat(getComputedStyle(div_index_iframe.parentElement, null).height), 10) - 36) + 'px';
	}
	this.outFunction_setIndexIframeDivSize();
	//******************************************************************************************

	//定義方法：使用iframe & 棄用iframe
	function useIframe(url) {
		div_index_iframe.style.display = 'block';
		changeStyle(div_index_iframe, 'left', 240, 8, function () {
			iframe_index.src = url;
		});
		changeStyle(div_imgtab, 'opacity', 0, 8, function () {
			div_imgtab.style.display = 'none';
		});
		changeStyle(div_img_leftbottom_jump, 'left', 0, 16, function () {});
		//blackbase
		changeStyle(div_blackbase, 'opacity', 60, 16, function () {});
	}
	//
	function quitIframe() {
		changeStyle(div_index_iframe,
			'left',
			(parseInt(parseFloat(getComputedStyle(div_index_iframe.parentElement, null).width), 10)),
			8,
			function () {
				div_index_iframe.style.display = 'none';
				iframe_index.src = '';
			}
		);
		changeStyle(div_img_leftbottom_jump, 'left', -256, 16, function () {});
		//blackbase
		changeStyle(div_blackbase, 'opacity', 0, 16, function () {});
		div_imgtab.style.display = 'block';
		changeStyle(div_imgtab, 'opacity', 50, 8, function () {});
	}
	//******************************************************************************************

	//******************************************************************************************
	//******************************事件綁定****************************************************
	//******************************************************************************************
	//事件綁定：主Menu
	div_menu.onmouseover = function () {
		clearTimeout(timer_menulist);
		changeStyle(div_menu, 'opacity', 100, 8, function () {});
		changeStyle(div_menu_bg, 'opacity', 50, 8, function () {});
		changeStyle(div_menu, 'height', (36 * 7 + 2), 16, function () {});

	}
	div_menu.onmouseout = function () {
		if (n_iframe_state >= 1 && n_iframe_state <= 5) {
			div_Mli[n_iframe_state].onmouseover();
			return;
		}
		timer_menulist = setTimeout(function () {
			changeStyle(div_menu, 'opacity', 30, 16, function () {});
			changeStyle(div_menu_bg, 'opacity', 20, 16, function () {});
			changeStyle(div_menu, 'height', 36, 24, function () {});
			changeStyle(div_menu_bg, 'top', 32, 8, function () {});
		}, 200);
	}
	//******************************************************************************************
	//事件綁定：主Menu列表項點擊***
	div_Mli[0].onclick = function () {
		n_iframe_state = 0;
		quitIframe();
	}
	div_Mli[1].onclick = function () {
		n_iframe_state = 1;
		useIframe("html/One.html");
	}
	div_Mli[2].onclick = function () {
		n_iframe_state = 2;
		useIframe("html/Two.html");
	}
	div_Mli[3].onclick = function () {
		n_iframe_state = 3;
		useIframe("html/Three.html");
	}
	div_Mli[4].onclick = function () {
		n_iframe_state = 4;
		useIframe("html/Four.html");
	}
	div_Mli[5].onclick = function () {
		n_iframe_state = 5;
		useIframe("html/about.html");
	}
	//******************************************************************************************
	//事件綁定：主Menu列表項觸發
	for (var i = 0; i < 6; i++) {
		div_Mli[i].onmouseover = function () {
			var newtop = i * 36 + 32 + 2;
			return function () {
				clearTimeout(div_Mtips.timer_outmenulist);
				console.log(this + ':follw:to:' + newtop);
				changeStyle(div_menu_bg, 'top', newtop, 4, function () {});
			}
		}(); //小括號與外層函數構成表達式立即執行，內部函數引用本次計算所得newtop完成閉包
		div_Mli[i].onmouseout = function () {
			changeStyle(div_menu_bg, 'top', 32, 8, function () {});
		}
	}
	//事件綁定：主Menu列表項Tips觸發
	div_Mli[6].onmouseover = function () {
		var newtop = 6 * 36 + 32 + 2;
		return function () {
			clearTimeout(div_Mtips.timer_outmenulist);
			console.log(this + ':follw:to:' + newtop);
			changeStyle(div_menu_bg, 'top', newtop, 4, function () {});
			div_Mtips.style.display = 'block';
			changeStyle(div_Mtips, 'opacity', 100, 8, function () {});
			///////////
			if (n_iframe_state >= 1 && n_iframe_state <= 5) {
				n_iframe_state_temp = n_iframe_state;
				n_iframe_state = 6;
				changeStyle(div_index_iframe, 'left', 496, 4, function () {});
			}
		}
	}(); //小括號與外層函數構成表達式立即執行，內部函數引用本次計算所得newtop完成閉包
	div_Mli[6].onmouseout = function () {
		//	changeStyle(div_menu_bg, 'top', 32, 8, function () {});
		changeStyle(div_Mtips, 'opacity', 0, 8, function () {
			div_Mtips.style.display = 'none';
		});
		/////////
		if (n_iframe_state == 6) {
			n_iframe_state = n_iframe_state_temp;
			changeStyle(div_index_iframe, 'left', 240, 4, function () {});
		}
	}
	//******************************************************************************************
	//事件綁定：主界面Tips顯示
	div_Mtips.onmouseover = function () {
		clearTimeout(timer_menulist);
		clearTimeout(this.timer_outmenulist);
		div_Mli[6].onmouseover();
	}
	div_Mtips.onmouseout = function () {
		this.timer_outmenulist = setTimeout(function () {
			div_menu.onmouseout();
		}, 250);
		/*
		changeStyle(div_Mtips, 'opacity', 0, 8, function () {
			div_Mtips.style.display = 'none';
		});
		*/
		div_Mli[6].onmouseout();
	}
	//******************************************************************************************
	//事件綁定：Tabs父層顯示
	div_imgtab.onmouseover = function () {
		changeStyle(this, 'opacity', 100, 8, function () {});
	}
	div_imgtab.onmouseout = function () {
		changeStyle(this, 'opacity', 50, 8, function () {});
	}
	//事件綁定：第一個Tab節點觸發
	div_li_ul_imgtab0.onmouseover = function () {
		clearInterval(timer_bgimg);
		toWitchBGImg(1);
	}
	div_li_ul_imgtab0.onmouseout = function () {
		clearInterval(timer_bgimg);
		timer_bgimg = startBGImgTimer();
	}
	//******************************************************************************************
	//******************************************************************************************
	//******************************************************************************************

	//	iframe_index.src="https://www.qcloud.com"
} //window.onload...

//當前窗口尺寸被更改
window.onresize = function () {
	this.outFunction_setIndexIframeDivSize();
}