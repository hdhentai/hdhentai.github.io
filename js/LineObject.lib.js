var randomLineChars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" + "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψω";

function LineObject(cvs, len, charSize, charSpace, fontFamily) {
	var line = {
		live: true,
		cvs: cvs,
		len: len || 64,
		charSize: charSize || 12,
		charSpace: charSpace || 1,
		fontFamily: fontFamily || 'verdana, ms song, 宋体, Arial, 微软雅黑, Helvetica, sans-serif',
		randomChars: [],
		headXY: {
			x: 0,
			y: 0
		},
		init: function () {
			this.headXY.x = parseFloat(Math.random() * cvs.width);
			this.headXY.y = this.charSize;
			this.randomChars.push(randomLineChars[parseInt(Math.random() * randomLineChars.length, 10)]);
		},
		recalculate: function () {
			this.headXY.y += this.charSize + this.charSpace;
			this.randomChars.push(randomLineChars[parseInt(Math.random() * randomLineChars.length, 10)]);
		},
		draw: function (ctx) {
			ctx.font = 'bold ' + this.charSize + 'px ' + this.fontFamily;
			var ny = this.headXY.y;
			for (var i = 0; i < this.len; i++) {
				if (ny <= 0) {
					break;
				} else if (ny - this.charSize > cvs.height) {
					// do nothing
				} else {
					ctx.fillStyle = 'rgba(40, 192, 80, ' + (this.len - i) / this.len + ')';
					ctx.fillText(this.randomChars[this.randomChars.length - i - 1], this.headXY.x, ny - this.charSize);
				}
				ny -= this.charSize + this.charSpace;
			}
			this.recalculate();
		},
		destroy: function () {
			this.live = null;
			this.cvs = null;
			this.len = null;
			this.charSize = null;
			this.charSpace = null;
			this.fontFamily = null;
			this.randomChars = null;
			this.headXY = null;
			this.init = null;
			this.recalculate = null;
			this.draw = null;
			this.destroy = null;
		}
	};
	return line;
}