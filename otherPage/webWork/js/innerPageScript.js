window.onload = function () {
	var n_bannerli_now = 1;
	var div_banner = document.getElementById("banner_div");
	var div_banner_childlis = document.getElementsByClassName("class_banner_li_div"); //0-bg/1-first
	//******************************************************************************************************
	var div_content_base = document.getElementById("content_base_div");
	var div_content_childtitles = document.getElementsByClassName("class_content_childtitle_div"); //0-n-1
	//
	this.div_content_bindBannerElements = new Array();
	div_content_bindBannerElements[0] = div_footer;
	div_content_bindBannerElements[1] = div_content_base;
	for (var i = 0; i < div_content_childtitles.length; i++) {
		div_content_childtitles[i].id = 'content_childtitle' + (i + 2) + '_div';
		div_content_bindBannerElements[i + 2] = div_content_childtitles[i];
		console.log((i + 2) + '::' + div_content_bindBannerElements[i + 2].id);
	}
	//******************************************************************************************************
	var div_footer = document.getElementById("footer");

	//0-bg/1-first/設置bannerli位置
	for (var i = 2; i < div_banner_childlis.length; i++) {
		div_banner_childlis[i].style.left = (
				parseInt(parseFloat(getComputedStyle(div_banner_childlis[i - 1], null).left), 10) +
				parseInt(parseFloat(getComputedStyle(div_banner_childlis[i - 1], null).width), 10)
			) +
			'px';
	}



	//事件綁定
	for (var i = 1; i < div_banner_childlis.length; i++) {
		console.log(i + '::' + div_banner_childlis[i].style.left);
		div_banner_childlis[i].onmouseover = function () {
			var ii = i;
			return function () {
				window.moveBannerBG(ii);
			}
		}();
		div_banner_childlis[i].onmouseout = function () {
			return function () {
				window.moveBannerBG(n_bannerli_now);
			}
		}();
		div_banner_childlis[i].onclick = function () {
			var ii = i;
			return function () {
				n_bannerli_now = ii;
				console.log(ii);
				//获取当前文档名
				var currentURL = window.location.href;
				console.log('currentURL:' + currentURL);
				var targetURL = currentURL;
				console.log('targetURL:' + targetURL);
				var currentDocName = currentURL.substring(currentURL.lastIndexOf('/') + 1);
				console.log('currentDocName:' + currentDocName);
				var jingIndex = currentDocName.indexOf('#');
				alert(jingIndex);
				if (jingIndex != -1) {
					targetURL = currentURL.substring(0, jingIndex);
				}
				console.log('targetURL:' + targetURL);
				window.location.href = targetURL + '#' + div_content_bindBannerElements[ii].id;
				//如果被banner覆蓋則向下滑動60空出banner位置
				if (div_content_bindBannerElements[ii].getBoundingClientRect().top < 59) {
					//pageXOffset與pageYOffset為scrollX與scrollY的別名，為了兼容IE用前兩個
					window.scrollTo(window.pageXOffset, window.pageYOffset - (59 - div_content_bindBannerElements[ii].getBoundingClientRect().top));
				}
			}
		}();
	}
	this.moveBannerBG = function (toWitch) {
		changeStyle(div_banner_childlis[0],
			'left',
			parseInt(parseFloat(getComputedStyle(div_banner_childlis[toWitch], null).left), 10),
			8,
			function () {});
		changeStyle(div_banner_childlis[0],
			'width',
			parseInt(parseFloat(getComputedStyle(div_banner_childlis[toWitch], null).width), 10),
			8,
			function () {});
	}
	this.theN_Bannerli_Now = function (nx) {
		if (nx != -1) {
			n_bannerli_now = nx;
		}
		return n_bannerli_now;
	}
	//**********************************************************************************
	//**********************************************************************************
	var img_contentimgs = document.getElementsByClassName("class_content_childimg_img");
	var div_viewpic = document.getElementById("viewpic_div");
	var img_viewpic = document.getElementById("viewpic_img");
	for (var i = 0; i < img_contentimgs.length; i++) {
		img_contentimgs[i].onclick = function () {
			img_viewpic.src = this.src;
			div_viewpic.style.display = 'block';
			img_viewpic.style.display = 'block';
			img_viewpic.style.top = '50%';
			img_viewpic.style.left = '50%';
			img_viewpic.style.top = (
					parseInt(parseFloat(getComputedStyle(img_viewpic, null).top), 10) -
					parseInt(parseFloat(getComputedStyle(img_viewpic, null).height), 10) / 2
				) +
				'px';
			img_viewpic.style.left = (
					parseInt(parseFloat(getComputedStyle(img_viewpic, null).left), 10) -
					parseInt(parseFloat(getComputedStyle(img_viewpic, null).width), 10) / 2
				) +
				'px';
			changeStyle(div_viewpic, 'opacity', 75, 4, function () {});
			changeStyle(img_viewpic, 'opacity', 100, 4, function () {});
		}
	}

	div_viewpic.onclick = function () {
		changeStyle(img_viewpic, 'opacity', 0, 4, function () {
			img_viewpic.style.display = 'none';
		});
		changeStyle(div_viewpic, 'opacity', 0, 4, function () {
			div_viewpic.style.display = 'none';
		});
	}

	img_viewpic.onclick = function () {
		changeStyle(img_viewpic, 'opacity', 0, 4, function () {
			img_viewpic.style.display = 'none';
		});
		changeStyle(div_viewpic, 'opacity', 0, 4, function () {
			div_viewpic.style.display = 'none';
		});
	}
}

window.onscroll = function () {

	console.log('top:' + document.getElementById("content_base_div").getBoundingClientRect().top);

	for (var i = 1; i < this.div_content_bindBannerElements.length; i++) {
		if (div_content_bindBannerElements[i].getBoundingClientRect().top > 60) {
			if (i == 1) {
				//不應的出現情況,防止萬一
				this.theN_Bannerli_Now(i);
			} else {
				this.theN_Bannerli_Now(i - 1);
			}
			this.moveBannerBG(this.theN_Bannerli_Now(-1));
			return;
		}
		if (i == div_content_bindBannerElements.length - 1) {
			this.moveBannerBG(this.theN_Bannerli_Now(i));
		}
	}

}