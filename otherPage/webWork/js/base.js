/*通用方法*/

//改變某一屬性//對象，屬性名，目標值,速度，收尾函數
function changeStyle(obj, name, end, speed, endF) {
	var start = 0;
	if (name == 'opacity') {
		start = parseInt(parseFloat(getComputedStyle(obj, null).opacity) * 100, 10);
	} else {
		start = parseInt(parseFloat(getComputedStyle(obj, null)[name]), 10);
	}
	var now_timer = 'timer_' + name;
	clearInterval(obj[now_timer]);
	obj[now_timer] = setInterval(function () {
		if (start == end) {
			clearInterval(obj[now_timer]);
			endF();
		} else {
			var add = (end - start) / speed;
			add = add > 0 ? Math.ceil(add) : Math.floor(add);
			start += add;
			if (name == 'opacity') {
				obj.style.opacity = start / 100;
			} else {
				obj.style[name] = start + 'px';
			}
		}
	}, 10);
}