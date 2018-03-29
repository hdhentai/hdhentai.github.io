/**
 * 修改IE不兼容MAP()的问题,自定义实现JavaScript的Map对象
 * 
 * http://www.matools.com/blog/p/1801462
 * 
 * 重写了Map对象，实现了常用的set, get, put, clear, remove, delete, forEach, has, containsKey, isEmpty, size 等方法，使用和声明的方试和正常声明Map对象一样
 * 
 * function Map() : 自定义Map构造函数,无参。
 * 
 * ***改进***
 * author : Z JL
 * 
 * 1.set方法bug：使用重复的_key，向容器中添加不存在的元素导致_key重复(_key对应两个_value)
 * ** 修改代码逻辑，若发现已有_key则先进行移除再进行添加操作
 * ** P.S.类似方法：put，未修改，故此bug应仍存在于put方法中。
 * 
 * 2.delete方法可能导致脚本无法运行：标识符delete，在IE8环境下导致js引擎报错
 * ** 删除了delete方法，删除操作使用remove方法完成。
 * 
 */
function Map() {
	this.elements = new Array();
	// 获取Map元素个数
	this.size = function () {
			return this.elements.length;
		},
		// 判断Map是否为空
		this.isEmpty = function () {
			return (this.elements.length < 1);
		},
		// 删除Map所有元素
		this.clear = function () {
			this.elements = new Array();
		},
		// 向Map中增加元素（key, value)
		this.put = function (_key, _value) {
			if (this.containsKey(_key) == true) {
				if (this.containsValue(_value)) {
					if (this.remove(_key) == true) {
						this.elements.push({
							key: _key,
							value: _value
						});
					}
				} else {
					this.elements.push({
						key: _key,
						value: _value
					});
				}
			} else {
				this.elements.push({
					key: _key,
					value: _value
				});
			}
		},
		// 向Map中增加元素（key, value)
		// 本方法已修改BUG：使用重复的_key，向容器中添加不存在的元素导致_key重复(_key对应两个_value)
		this.set = function (_key, _value) {
			if (this.containsKey(_key) == true) {
				if (this.get(_key) != _value) {
					this.remove(_key);
				} else {
					return;
				}
			}
			this.elements.push({
				key: _key,
				value: _value
			});
		},
		// 删除指定key的元素，成功返回true，失败返回false
		this.remove = function (_key) {
			var bln = false;
			try {
				for (i = 0; i < this.elements.length; i++) {
					if (this.elements[i].key == _key) {
						this.elements.splice(i, 1);
						return true;
					}
				}
			} catch (e) {
				bln = false;
			}
			return bln;
		},

		// 获取指定key的元素值value，失败返回null
		this.get = function (_key) {
			try {
				for (i = 0; i < this.elements.length; i++) {
					if (this.elements[i].key == _key) {
						return this.elements[i].value;
					}
				}
			} catch (e) {
				return null;
			}
		},

		// set指定key的元素值value
		this.setValue = function (_key, _value) {
			var bln = false;
			try {
				for (i = 0; i < this.elements.length; i++) {
					if (this.elements[i].key == _key) {
						this.elements[i].value = _value;
						return true;
					}
				}
			} catch (e) {
				bln = false;
			}
			return bln;
		},

		// 获取指定索引的元素（使用element.key，element.value获取key和value），失败返回null
		this.element = function (_index) {
			if (_index < 0 || _index >= this.elements.length) {
				return null;
			}
			return this.elements[_index];
		},

		// 判断Map中是否含有指定key的元素
		this.containsKey = function (_key) {
			var bln = false;
			try {
				for (i = 0; i < this.elements.length; i++) {
					if (this.elements[i].key == _key) {
						bln = true;
					}
				}
			} catch (e) {
				bln = false;
			}
			return bln;
		},

		// 判断Map中是否含有指定key的元素
		this.has = function (_key) {
			var bln = false;
			try {
				for (i = 0; i < this.elements.length; i++) {
					if (this.elements[i].key == _key) {
						bln = true;
					}
				}
			} catch (e) {
				bln = false;
			}
			return bln;
		},

		// 判断Map中是否含有指定value的元素
		this.containsValue = function (_value) {
			var bln = false;
			try {
				for (i = 0; i < this.elements.length; i++) {
					if (this.elements[i].value == _value) {
						bln = true;
					}
				}
			} catch (e) {
				bln = false;
			}
			return bln;
		},

		// 获取Map中所有key的数组（array）
		this.keys = function () {
			var arr = new Array();
			for (i = 0; i < this.elements.length; i++) {
				arr.push(this.elements[i].key);
			}
			return arr;
		},

		// 获取Map中所有value的数组（array）
		this.values = function () {
			var arr = new Array();
			for (i = 0; i < this.elements.length; i++) {
				arr.push(this.elements[i].value);
			}
			return arr;
		};

	/**
	 * map遍历数组
	 * @param callback [function] 回调函数；
	 * @param context [object] 上下文；
	 */
	this.forEach = function forEach(callback, context) {
		context = context || window;

		//IE6-8下自己编写回调函数执行的逻辑
		var newAry = new Array();
		for (var i = 0; i < this.elements.length; i++) {
			if (typeof callback === 'function') {
				var val = callback.call(context, this.elements[i].value, this.elements[i].key, this.elements);
				newAry.push(this.elements[i].value);
			}
		}
		return newAry;
	}

}