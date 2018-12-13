// global var
var spanCount = Number(0);
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789" + "ΑΒΓΔΕΖΗΘΙΚΛΜΝΞΟΠΡΣΤΥΦΧΨΩαβγδεζηθικλμνξοπρστυφχψω";

function createE(params) {
    var lspan = document.createElement('span');
    lspan.innerText = chars.charAt(parseInt(Math.random() * chars.length, 10));
    lspan.className = 'letterSpan';
    lspan.style.opacity = 1.000;
    return lspan;
}

function Line(parentE, maxSize) {
    var oline = {
        isLive: true,
        parent: parentE,
        maxsize: maxSize,
        es: [],
        start: function () {
            if (!this.isLive) {
                return;
            }
            var left = parseFloat(Math.random() * this.parent.clientWidth);
            var top = parseFloat(Math.random() * this.parent.clientHeight);
            top = 0;
            var lspan = createE();
            lspan.style.left = left + 'px';
            lspan.style.top = top + 'px';
            this.parent.appendChild(lspan);
            if (!this.isLive) {
                this.parent.innerHTML = '';
                spanCount = Number(0);
                this.es = [];
                return;
            }
            this.es.push(lspan);
            spanCount += 1;
            // document.title = spanCount;
            this.next();
        },
        next: function () {
            if (!this.isLive) {
                return;
            }
            var prevE = this.es[this.es.length - 1];
            // console.log(prevE);
            var top = parseFloat(prevE.style.top) + 14;
            if (top > this.parent.clientHeight) {
                this.clean();
                return;
            }
            var nspan = createE();
            nspan.style.left = prevE.style.left;
            nspan.style.top = top + 'px';
            this.parent.appendChild(nspan);
            if (!this.isLive) {
                this.parent.innerHTML = '';
                spanCount = Number(0);
                this.es = [];
                return;
            }
            if (this.es.length == this.maxsize) {
                try {
                    this.parent.removeChild(this.es[0]);
                } catch (err) {
                    console.log(err);
                    // return;
                }
                this.es.shift();
                this.es.push(nspan);
                this.refresh();
            } else if (this.es.length > this.maxsize) {
                alert('error');
            } else {
                this.es.push(nspan);
                spanCount += 1;
                // document.title = spanCount;
                this.refresh();
            }

            var thisLine = this;
            setTimeout(function () {
                thisLine.next();
            }, 25);
        },
        clean: function () {
            if (!this.isLive) {
                return;
            }
            // console.log(parseFloat(this.es[0].style.opacity));
            try {
                this.parent.removeChild(this.es[0]);
            } catch (err) {
                console.log(err);
                // return;
            }
            this.es.shift();
            spanCount -= 1;
            // document.title = spanCount;
            if (this.es.length == 0) {
                return;
            }
            this.es[this.es.length - 1].style.opacity = this.es.length / this.maxsize;
            this.refresh();
            var thisLine = this;
            setTimeout(function () {
                thisLine.clean();
            }, 25);
        },
        refresh: function (params) {
            if (!this.isLive) {
                this.parent.innerHTML = '';
                spanCount = Number(0);
                this.es = [];
                return;
            }
            var allLetterSpan = this.parent.querySelectorAll('.letterSpan');
            if (allLetterSpan.length > 678) {
                this.isLive = false;
                this.parent.innerHTML = '';
                spanCount = Number(0);
                this.es = [];
                var thisLine = this;
                setTimeout(function () {
                    thisLine.parent.innerHTML = '';
                    spanCount = Number(0);
                    thisLine.es = [];
                }, 999);
                return;
            }
            var change = 1000 / this.maxsize;
            // console.log(change);
            for (var i = this.es.length - 2; i >= 0; i--) {
                this.es[i].style.opacity = (parseFloat(this.es[i + 1].style.opacity) * 1000 -
                    change) / 1000;
                // console.log(this.es[i]);
                // console.log(parseFloat(this.es[i].style.opacity));
            }
        }
    };
    return oline;
}