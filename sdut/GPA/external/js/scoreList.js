/**
 * scoreList.js
 * 
 * author: MiK
 * 
 * version: 1.1
 */

/**
 * parse stuID from URL
 * 
 * @param {*} params 
 */
function getQueryStuID(params) {
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
	if (queryString_stuID == null || queryString_stuID == undefined || queryString_stuID == "") {
		alert("学号不见辣！");
		console.log("Error : parse stuID failed.");
		window.location.href = "./index.html";
	}
	console.log("Info : parse stuID(" + queryString_stuID + ") success.");
	document.getElementById("stuIDTd").innerText = queryString_stuID;
	return queryString_stuID;
}

/**
 * convert string to number
 * 
 * @param {String} params 
 */
function convertNumber(params) {
	var tempV = Number(params);
	if (!isNaN(tempV)) {
		return tempV;
	} else if (params == "合格") {
		return 70;
	} else if (params == "优秀") {
		return 95;
	} else if (params == "良好") {
		return 84;
	} else if (params == "中等") {
		return 73;
	} else if (params == "及格") {
		return 62;
	} else if (params == "免修") { // TODO 以下为二专业计分方式，待补充
		return 62;
	} else if (params == "优") {
		return 95;
	} else if (params == "良") {
		return 84;
	} else { // 其他情况如（不及格，缺考，禁考，缓考...）
		return 0;
	}
}

/**
 * set tr class where orderNumber = params oN
 * 
 * @param {Number} orderNumber 
 * @param {String} cls 
 */
function setViewColor(orderNumber, cls) {
	var allTr = document.getElementById("scoreTableTbody").getElementsByTagName("tr");
	if (orderNumber <= 0) {
		for (var i = 1; i < allTr.length; i++) {
			allTr[i].className = cls;
		}
		return;
	}
	// TODO - order not right
	allTr[Number(orderNumber) + 1].className = cls;

}

/**
 * check score and display use different color
 * 
 * @param {Array} scoreList 
 */
function displayScoreList(scoreList) {
	//display score list
	var tbody_scoreTableTbody = document.getElementById("scoreTableTbody");
	var map = new Map();
	for (var i = 0; i < scoreList.length; i++) {
		// manager map
		var courseName = scoreList[i].name;
		var scores = map.get(courseName);
		if (scores == null || scores == undefined) {
			var tempArr = new Array();
			tempArr.push({
				orderNumber: i,
				score: scoreList[i]
			});
			map.set(courseName, tempArr);
		} else {
			scores.push({
				orderNumber: i,
				score: scoreList[i]
			});
		}
		// add tr
		var temptr = document.createElement("tr");
		var temptd = null;

		temptd = document.createElement("td");
		temptd.innerText = i + 1;
		temptr.appendChild(temptd);

		temptd = document.createElement("td");
		temptd.innerText = scoreList[i].term;
		temptr.appendChild(temptd);

		temptd = document.createElement("td");
		temptd.innerText = scoreList[i].type;
		temptr.appendChild(temptd);

		temptd = document.createElement("td");
		temptd.innerText = scoreList[i].name;
		temptr.appendChild(temptd);

		temptd = document.createElement("td");
		temptd.innerText = scoreList[i].point;
		temptr.appendChild(temptd);

		temptd = document.createElement("td");
		temptd.innerText = scoreList[i].origGrade;
		temptr.appendChild(temptd);

		temptd = document.createElement("td");
		temptd.innerText = scoreList[i].reGrade;
		temptr.appendChild(temptd);

		tbody_scoreTableTbody.appendChild(temptr);
	}
	console.log("Map : ");
	console.log(map);
	console.log(".");
	// forEach map
	map.forEach(function (v, k) {
		if (v.length > 1) {
			var maxScoreS = -1;
			var maxScoreIndex = -1;
			for (var i = 0; i < v.length; i++) {
				if (Number(convertNumber(v[i].score.origGrade)) > maxScoreS) {
					maxScoreS = Number(convertNumber(v[i].score.origGrade));
					maxScoreIndex = i;
				} else if (Number(convertNumber(v[i].score.reGrade)) > maxScoreS) {
					maxScoreS = Number(convertNumber(v[i].score.reGrade));
					maxScoreIndex = i;
				}
			}
			if (maxScoreS < 60) {
				if (v[v.length - 1].score.type != "公选课") {
					setViewColor(v[v.length - 1].orderNumber, "redWarningTr");
				} else {
					setViewColor(v[v.length - 1].orderNumber, "yellowWarningTr");
				}
			} else {
				if (v[maxScoreIndex].score.type != "公选课") {
					setViewColor(v[maxScoreIndex].orderNumber, "effectiveTr");
				}
			}
		} else {
			if (Number(convertNumber(v[0].score.origGrade)) < 60 && Number(convertNumber(v[0].score.reGrade)) < 60) {
				if (v[0].score.type != "公选课") {
					setViewColor(v[0].orderNumber, "redWarningTr");
				} else {
					setViewColor(v[0].orderNumber, "yellowWarningTr");
				}
			} else {
				if (v[0].score.type != "公选课") {
					setViewColor(v[0].orderNumber, "effectiveTr");
				}
			}
		}
	});
}

/**
 * process API response from stuObj
 * 
 * @param {Object} stuObj 
 */
function processResponse(stuObj) {
	console.log("API response : " + stuObj.code + " : " + stuObj.status + " : " + stuObj.message + ".");
	if (stuObj.code == 0) {
		// ok
		console.log("stuObj : ");
		console.log(stuObj);
		console.log(".");
		// display gpa info
		document.getElementById("stuNameTd").innerText = stuObj.data.student.name;
		document.getElementById("pointTd").innerText = stuObj.data.major.point;
		document.getElementById("totalPointTd").innerText = stuObj.data.major.totalPoint;
		document.getElementById("GPATd").innerText = stuObj.data.major.grade;
		//call displayScoreList function
		displayScoreList(stuObj.data.major.list);

	} else if (stuObj.code == 1) {
		// stuID error
		alert("乃似乎把学号填错了呢QwQ再试一次吧！");
		window.location.href = "./index.html";
	} else if (stuObj.code == -1) {
		// what error?
		alert("似乎是窝的工作粗了什么问题QAQ再试一次可好？");
		window.location.href = "./index.html";
	} else {
		// API error
		alert("窝使用的API似乎出现了什么不可预料的错误！\n乃可以打开控制台查看详细的错误信息哦Q^Q");
		window.location.href = "./index.html";
	}
}

/**
 * ajax request data from API
 * 
 * API Doc : http://api.dogest.cn/grade/index.html
 * 
 * @param {String} stuID 
 */
function ajax_getStuDataJSON(stuID) {
	var IEV = IEVersion();
	console.log("Info : IEVersion : " + IEV);
	if (IEV == 6 || IEV == 7) {
		// don't support
		alert("乃的浏览器是老古董啦！快换个现代浏览器叭qwq~");
		console.log("Error : browser version so low.");
		window.location.href = "./index.html";
	} else if (IEV == 8 || IEV == 9) {
		var xdr = new XDomainRequest();
		var url = "http://api.dogest.cn/grade/grade/query?id=" + stuID;
		xdr.onload = function (params) {
			console.log("ajax : response onload.");
			// call processResponse function
			processResponse(JSON.parse(this.responseText));
		}
		xdr.onerror = function (params) {
			alert("窝没有请求到数据的说\n刷新一下试试吧qwq");
			console.log("ajax : xdr send request & xdr call onerror().");
		}
		xdr.open("GET", url);
		xdr.send();
	} else {
		var xhr = new XMLHttpRequest();
		var url = "http://api.dogest.cn/grade/grade/query?id=" + stuID;
		xhr.onreadystatechange = function (params) {
			console.log("ajax : request status changed : " + this.readyState + " : " + this.status);
			if (this.readyState == 4 && this.status == 200) {
				// call processResponse function
				processResponse(JSON.parse(this.responseText));
			}
		}
		xhr.open("GET", url, true);
		xhr.send();
	}
}

window.onload = function (params) {

	// this.alert(getQueryStuID());

	ajax_getStuDataJSON(getQueryStuID());

}