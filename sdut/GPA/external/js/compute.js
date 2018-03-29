/**
 * comput GPA
 */


var callBackFunction_GET_jsonData;
var stuObject = null;

window.onload = function () {
	//获取成绩表体
	var tbody_scoreTableTbody = document.getElementById("scoreTableTbody");

	//显示成绩列表
	function displayScoreData(stuObject) {

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
			temptd.onclick = function (params) {
				var orderN = this.parentElement.getElementsByTagName("td")[0].innerText;
				var input = window.prompt("请输入您预期的分数：", "例如：95，合格，优秀");
				if (input == null || input == undefined) {
					alert("未产生修改~");
				} else {
					for (var i = 0; i < stuObject.scoreList.length; i++) {
						if (Number(stuObject.scoreList[i].orderNumber) === Number(orderN)) {
							stuObject.scoreList[i].examScore = input;
							alert("序号为[" + orderN + "]的课程：" + stuObject.scoreList[i].courseName + "\n原考成绩已修改为预期成绩：" + stuObject.scoreList[i].examScore + "\n（即有效值为：" + convertDouble(stuObject.scoreList[i].examScore) + "分）\n绩点将会重新计算！");
							this.innerText = stuObject.scoreList[i].examScore + " (hope)";
							break;
						}
					}
					computeGPA(stuObject);
				}
			}
			temptd.innerText = stuObject.scoreList[i].examScore;
			temptr.appendChild(temptd);

			temptd = document.createElement("td");
			temptd.onclick = function (params) {
				var orderN = this.parentElement.getElementsByTagName("td")[0].innerText;
				var input = window.prompt("请输入您预期的分数：", "例如：95，合格，优秀");
				if (input == null || input == undefined) {
					alert("未产生修改");
				} else {
					for (var i = 0; i < stuObject.scoreList.length; i++) {
						if (Number(stuObject.scoreList[i].orderNumber) === Number(orderN)) {
							stuObject.scoreList[i].reExamScore = input;
							alert("序号为[" + orderN + "]的课程：" + stuObject.scoreList[i].courseName + "\n原考成绩已修改为预期成绩：" + stuObject.scoreList[i].reExamScore + "\n（即有效值为：" + convertDouble(stuObject.scoreList[i].reExamScore) + "分）\n绩点将会重新计算！");
							this.innerText = stuObject.scoreList[i].reExamScore + " (hope)";
							break;
						}
					}
					computeGPA(stuObject);
				}
			}
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
		}

	}

	//转换分数
	function convertDouble(str) {
		var tempv = Number(str);
		if (!isNaN(tempv)) {
			return tempv;
		} else if (str === "合格") {
			return 70;
		} else if (str === "优秀") {
			return 95;
		} else if (str === "良好") {
			return 84;
		} else if (str === "中等") {
			return 73;
		} else if (str === "及格") {
			return 62;
		} else if (str === "免修") { // TODO 以下为二专业计分方式，待补充
			return 62;
		} else if (str === "优") {
			return 95;
		} else if (str === "良") {
			return 84;
		} else { // 其他情况如（不及格，缺考，禁考，缓考...）
			return 0;
		}
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

	//视觉
	function reView(score, cls) {
		//获取成绩表所有行s
		var allScore = tbody_scoreTableTbody.getElementsByTagName("tr");
		if (score == null) {
			for (var i = 1; i < allScore.length; i++) {
				allScore[i].className = cls;
			}
			return;
		}
		for (var i = 1; i < allScore.length; i++) {
			if (allScore[i].getElementsByTagName("td")[0].innerText === score.orderNumber) {
				allScore[i].className = cls;
				break;
			}
		}
	}

	//**计算绩点 */
	function computeGPA(stuObject) {
		reView(null, "");
		var creditSum = Number('0');
		var creditGPASum = Number('0');
		var GPA = Number('0');
		var map = new Map();
		for (var i = 0; i < stuObject.scoreList.length; i++) {
			var score = stuObject.scoreList[i];
			var courseName = score.courseName;
			var examScoreS = Number(getEffectiveScoreS(score));
			var tempScore = map.get(courseName);
			if (tempScore == null || tempScore == undefined) {
				map.set(courseName, score);
			} else {
				var tempScoreS = Number(getEffectiveScoreS(tempScore));
				map.set(courseName, convertDouble(examScoreS) > convertDouble(tempScoreS) ? score : tempScore);
				console.log('set:' + courseName);
				console.log(convertDouble(examScoreS) > convertDouble(tempScoreS) ? score : tempScore);
			}
		}
		console.log(map.elements);
		//兼容性好，有替代实现，替代下文
		map.forEach(function (v, k) {
			var score = v;
			if (score.type !== "公选课") {
				if (Number(convertDouble(score.examScore)) < 60 && Number(convertDouble(score.reExamScore)) < 60) {
					reView(score, "redWarningTr");
				} else {
					reView(score, "effectiveTr");
				}
				creditSum += convertDouble(score.credit);
				var examScoreS = Number(getEffectiveScoreS(score));
				var temp = convertDouble(examScoreS);
				creditGPASum += convertDouble(score.credit) * (temp >= 60 ? temp : 0);
			} else {
				if (Number(convertDouble(score.examScore)) < 60 && Number(convertDouble(score.reExamScore)) < 60) {
					reView(score, "yellowWarningTr");
				} else {
					reView(score, "");
				}
			}
		});

		//兼容性差，换用上文实现
		// for (var kv of map) {
		// 	var score = kv[1];
		// 	if (score.type !== "公选课") {
		// 		if (Number(convertDouble(score.examScore)) < 60 && Number(convertDouble(score.reExamScore)) < 60) {
		// 			reView(score, "redWarningTr");
		// 		} else {
		// 			reView(score, "effectiveTr");
		// 		}
		// 		creditSum += convertDouble(score.credit);
		// 		var examScoreS = Number(getEffectiveScoreS(score));
		// 		var temp = convertDouble(examScoreS);
		// 		creditGPASum += convertDouble(score.credit) * (temp >= 60 ? temp : 0);
		// 	} else {
		// 		if (Number(convertDouble(score.examScore)) < 60 && Number(convertDouble(score.reExamScore)) < 60) {
		// 			reView(score, "yellowWarningTr");
		// 		} else {
		// 			reView(score, "");
		// 		}
		// 	}
		// }

		GPA = creditGPASum / creditSum;

		console.log(creditSum + ":" + creditGPASum + ":" + GPA);
		document.getElementById("creditGPASumTd").innerText = creditGPASum;
		document.getElementById("creditSumTd").innerText = creditSum;
		document.getElementById("GPATd").innerText = GPA;
	}

	//跨域回调函数
	callBackFunction_GET_jsonData = function (jsonString) {
		stuObject = JSON.parse(jsonString);
		displayScoreData(stuObject);
		//文档结构稳定
		computeGPA(stuObject);
	}

	//**跨域调用
	function jsonp_runScript(requestURL, function_callBack, otherGETparams) {
		var dataJSONP = document.createElement("script");
		dataJSONP.src = requestURL + "?function_callBack=" + function_callBack + otherGETparams;
		document.body.appendChild(dataJSONP);
	}

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
		window.location.href = "./index.html";
	}
	document.getElementById("stuIDTd").innerText = queryString_stuID;
	// alert(queryString_stuID);
	//开始跨域调用
	jsonp_runScript("http://hen-tai.top:23333/SDUT.GPA/" + queryString_stuID + ".SDUTStudentScoreDataJSONString", "callBackFunction_GET_jsonData", "&stuID=" + queryString_stuID);

}