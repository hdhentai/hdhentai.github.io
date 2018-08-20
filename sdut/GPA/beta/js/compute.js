/**
 * comput GPA
 */


// 全局变量
var callBackFunction_GET_jsonData;
var stuObject = null;

var clsList = null;
var clsList2 = null;

window.onload = function () {
	//获取成绩表体
	var tbody_scoreTableTbody = document.getElementById("scoreTableTbody");

	// 获取传入学号
	var queryString = "";
	var queryString_stuID = null;
	queryString = window.location.search;
	if (queryString.indexOf("?") != -1) {
		var kvs = queryString.substr(1).split("&");
		for (var i = 0; i < kvs.length; i++) {
			var kv = kvs[i].split("=");
			if (kv.length == 2) {
				if (kv[0] == "stuID") {
					queryString_stuID = kv[1];
					break;
				}
			}
		}
	}
	// 检查学号
	if (queryString_stuID == null || queryString_stuID == undefined || queryString_stuID == "") {
		alert("学号不见辣！");
		window.location.href = "./index.html";
	}
	document.getElementById("stuIDTd").innerText = queryString_stuID;

	// 定义跨域回调函数
	callBackFunction_GET_jsonData = function (jsonString) {
		stuObject = JSON.parse(jsonString);

		computeGPA(stuObject);
	}

	// 定义跨域调用函数
	function jsonp_runScript(requestURL, function_callBack, otherGETparams) {
		var dataJSONP = document.createElement("script");
		dataJSONP.src = requestURL + "?function_callBack=" + function_callBack + otherGETparams;
		document.body.appendChild(dataJSONP);
	}

	//开始跨域调用
	jsonp_runScript("http://hen-tai.top:23333/SDUT.GPA/" + queryString_stuID + ".SDUTStudentScoreDataJSONString", "callBackFunction_GET_jsonData", "&stuID=" + queryString_stuID);

	// jsonp_runScript("http://127.0.0.1:8080/SDUT.GPA/" + queryString_stuID + ".SDUTStudentScoreDataJSONString", "callBackFunction_GET_jsonData", "&stuID=" + queryString_stuID);


	// 计算绩点
	function computeGPA(stuObject) {

		// 第一专业成绩列表为空
		if (stuObject.scoreList.length == 0) {
			alert('成绩列表为空！如果可以在教务系统的（http://210.44.176.116/cjcx/）页面查询到成绩信息，请点击反馈链接告知！谢谢！');
			window.location.href = "./index.html";
			return;
		}

		// 第一专业
		// 整理有效成绩
		var sMap = new Map();
		clsList = new Array();
		for (var i = 0; i < stuObject.scoreList.length; i++) {
			var score = stuObject.scoreList[i];
			var courseName = score.courseName;
			var effectiveExamScore = Number(getEffectiveScoreS(score));
			var temp = sMap.get(courseName);
			if (temp == null || temp == undefined) {
				var index = i;
				var obj = score;
				var effectiveScore = effectiveExamScore;
				sMap.set(courseName, {
					"index": index,
					"obj": obj,
					"effectiveScore": effectiveScore
				});
				if (effectiveScore < 60) {
					clsList[index] = obj.type == '公选课' ? 'yellowWarningTr' : 'redWarningTr';
				} else {
					clsList[index] = obj.type == '公选课' ? '' : 'effectiveTr';
				}
			} else {
				// 当前成绩大于已记录成绩 或 都不够60
				if (effectiveExamScore > Number(temp.effectiveScore) || (effectiveExamScore < 60 && Number(temp.effectiveScore) < 60)) {
					var index = i;
					var obj = score;
					var effectiveScore = effectiveExamScore;
					sMap.set(courseName, {
						"index": index,
						"obj": obj,
						"effectiveScore": effectiveScore
					});
					clsList[Number(temp.index)] = '';
					if (effectiveScore < 60) {
						clsList[index] = obj.type == '公选课' ? 'yellowWarningTr' : 'redWarningTr';
					} else {
						clsList[index] = obj.type == '公选课' ? '' : 'effectiveTr';
					}
				}
			}
		}

		// 计算绩点
		var creditGPASum = Number(0);
		var creditSum = Number(0);
		sMap.forEach(function (v, k) {
			if (v.obj.type != '公选课') {
				creditSum += Number(v.obj.credit);
				creditGPASum += v.obj.credit * (v.effectiveScore < 60 ? 0 : v.effectiveScore);
			}
		});

		GPA = creditGPASum / creditSum;

		console.log(creditSum + ":" + creditGPASum + ":" + GPA);
		document.getElementById("creditGPASumTd").innerText = creditGPASum;
		document.getElementById("creditSumTd").innerText = creditSum;
		document.getElementById("GPATd").innerText = GPA;

		displayScoreData(stuObject);
	}

	//获得有效成绩
	function getEffectiveScoreS(score) {
		if (score == null || score == undefined) {
			return convertDouble('0');
		}
		if (convertDouble(score.reExamScore) - convertDouble(score.examScore) > 0) {
			return convertDouble(score.reExamScore);
		} else {
			return convertDouble(score.examScore);
		}
	}

	/**
	 * 转换分数
	 * 
	 * @param {String} str 
	 */
	function convertDouble(str) {
		var tempv = Number(str);
		if (!isNaN(tempv)) {
			return tempv;
		} else {
			str = String(str);
			if ("-" === str) {
				return 0;
			} else if ("合格" === str) {
				return 70;
			} else if ("不合格" === str) {
				return 0;
			} else if ("优秀" === str) {
				return 95;
			} else if ("良好" === str) {
				return 84;
			} else if ("中等" === str) {
				return 73;
			} else if ("及格" === str) {
				return 62;
			} else if ("不及格" === str) {
				return 0;
			} else if ("缺考" === str) {
				return 0;
			} else if ("禁考" === str) {
				return 0;
			} else if ("退学" === str) {
				return 0;
			} else if ("缓考（时" === str) { // 这是什么鬼
				return 0;
			} else if ("缓考" === str) {
				return 0;
			} else if ("休学" === str) {
				return 0;
			} else if ("未选" === str) {
				return 0;
			} else if ("作弊" === str) {
				return 0;
			} else if ("取消" === str) {
				return 0;
			} else if ("免修" === str) { // 似乎应该是62才对
				return 62;
			} else if ("优" === str) {
				return 95;
			} else if ("良" === str) {
				return 84;
			} else if ("中" === str) {
				return 73;
			} else {
				return 0;
			}
		}
	}

	//显示成绩列表
	function displayScoreData(stuObject) {

		tbody_scoreTableTbody.innerHTML = '';
		tbody_scoreTableTbody.innerText = '';

		for (var i = 0; i < stuObject.scoreList.length; i++) {
			var temptr = document.createElement("tr");
			var temptd = null;

			temptd = document.createElement("td");
			temptd.innerText = stuObject.scoreList[i].orderNumber;
			temptr.appendChild(temptd);

			temptd = document.createElement("td");
			temptd.innerText = stuObject.scoreList[i].schoolYear;
			temptr.appendChild(temptd);

			temptd = document.createElement("td");
			temptd.innerText = stuObject.scoreList[i].schoolTerm;
			temptr.appendChild(temptd);

			temptd = document.createElement("td");
			temptd.innerText = stuObject.scoreList[i].type;
			temptr.appendChild(temptd);

			temptd = document.createElement("td");
			temptd.innerText = stuObject.scoreList[i].courseNumber;
			temptr.appendChild(temptd);

			temptd = document.createElement("td");
			temptd.innerText = stuObject.scoreList[i].courseName;
			temptr.appendChild(temptd);

			temptd = document.createElement("td");
			temptd.innerText = stuObject.scoreList[i].classHour;
			temptr.appendChild(temptd);

			temptd = document.createElement("td");
			temptd.innerText = stuObject.scoreList[i].credit;
			temptr.appendChild(temptd);

			temptd = document.createElement("td");
			temptd.innerText = stuObject.scoreList[i].examination;
			temptr.appendChild(temptd);

			temptd = document.createElement("td");
			temptd.innerText = stuObject.scoreList[i].examScore;
			temptr.appendChild(temptd);

			temptd = document.createElement("td");
			temptd.innerText = stuObject.scoreList[i].reExamScore;
			temptr.appendChild(temptd);

			temptd = document.createElement("td");
			temptd.innerText = stuObject.scoreList[i].courseGPA;
			temptr.appendChild(temptd);

			temptd = document.createElement("td");
			temptd.innerText = stuObject.scoreList[i].creditGPA;
			temptr.appendChild(temptd);

			temptd = document.createElement("td");
			temptd.innerText = stuObject.scoreList[i].teacher;
			temptr.appendChild(temptd);

			tbody_scoreTableTbody.appendChild(temptr);

			temptr.className = clsList[i];
		}

	}

	document.getElementById('editScoreBtn').onclick = function (params) {
		var editbg = document.getElementById('editScoreJSONDiv');
		editbg.style.display = '';
		var dataTextarea = document.getElementById('cusData');
		dataTextarea.value = formatJson(JSON.stringify(stuObject.scoreList));
	}

	document.getElementById('exitEditDiv').onclick = function (params) {
		var editbg = document.getElementById('editScoreJSONDiv');
		editbg.style.display = 'none';
		var dataTextarea = document.getElementById('cusData');
		var cusDataJSON = dataTextarea.value;
		var cusScoreList = null;
		try {
			cusScoreList = JSON.parse(cusDataJSON);
		} catch (e) {
			alert('您的修改有误，请参照已有数据格式修改！');
			window.location.href = window.location.href;
			return;
		}
		stuObject.scoreList = cusScoreList;
		computeGPA(stuObject);
		// var formatJSON = formatJson(JSON.stringify(stuObject.scoreList));
		// document.getElementById("test").value = formatJSON;
	}

	// 格式化JSON
	// https://www.cnblogs.com/Sinhtml/p/8336930.html
	function formatJson(json, options) {
		var reg = null,
			formatted = '',
			pad = 0,
			PADDING = '    ';
		options = options || {};
		options.newlineAfterColonIfBeforeBraceOrBracket = (options.newlineAfterColonIfBeforeBraceOrBracket === true) ? true : false;
		options.spaceAfterColon = (options.spaceAfterColon === false) ? false : true;
		if (typeof json !== 'string') {
			json = JSON.stringify(json);
		} else {
			json = JSON.parse(json);
			json = JSON.stringify(json);
		}
		reg = /([\{\}])/g;
		json = json.replace(reg, '\r\n$1\r\n');
		reg = /([\[\]])/g;
		json = json.replace(reg, '\r\n$1\r\n');
		reg = /(\,)/g;
		json = json.replace(reg, '$1\r\n');
		reg = /(\r\n\r\n)/g;
		json = json.replace(reg, '\r\n');
		reg = /\r\n\,/g;
		json = json.replace(reg, ',');
		if (!options.newlineAfterColonIfBeforeBraceOrBracket) {
			reg = /\:\r\n\{/g;
			json = json.replace(reg, ':{');
			reg = /\:\r\n\[/g;
			json = json.replace(reg, ':[');
		}
		if (options.spaceAfterColon) {
			reg = /\:/g;
			json = json.replace(reg, ':');
		}
		(json.split('\r\n')).forEach(function (node, index) {
			var i = 0,
				indent = 0,
				padding = '';

			if (node.match(/\{$/) || node.match(/\[$/)) {
				indent = 1;
			} else if (node.match(/\}/) || node.match(/\]/)) {
				if (pad !== 0) {
					pad -= 1;
				}
			} else {
				indent = 0;
			}

			for (i = 0; i < pad; i++) {
				padding += PADDING;
			}

			formatted += padding + node + '\r\n';
			pad += indent;
		});
		return formatted;
	};
}