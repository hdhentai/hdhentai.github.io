/**
 * scoreList.js
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
 * display Score List from stuObj
 * 
 * @param {*} stuObj 
 */
function displayScoreList(stuObj) {
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
		//display score list
		var tbody_scoreTableTbody = document.getElementById("scoreTableTbody");
		for (var i = 0; i < stuObj.data.major.list.length; i++) {
			var temptr = document.createElement("tr");
			var temptd = null;

			temptd = document.createElement("td");
			temptd.innerText = i;
			temptr.appendChild(temptd);

			temptd = document.createElement("td");
			temptd.innerText = stuObj.data.major.list[i].term;
			temptr.appendChild(temptd);

			temptd = document.createElement("td");
			temptd.innerText = stuObj.data.major.list[i].type;
			temptr.appendChild(temptd);

			temptd = document.createElement("td");
			temptd.innerText = stuObj.data.major.list[i].name;
			temptr.appendChild(temptd);

			temptd = document.createElement("td");
			temptd.innerText = stuObj.data.major.list[i].point;
			temptr.appendChild(temptd);

			temptd = document.createElement("td");
			temptd.innerText = stuObj.data.major.list[i].origGrade;
			temptr.appendChild(temptd);

			temptd = document.createElement("td");
			temptd.innerText = stuObj.data.major.list[i].reGrade;
			temptr.appendChild(temptd);

			tbody_scoreTableTbody.appendChild(temptr);
		}

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
 * @param {*} params 
 */
function ajax_getStuDataJSON(stuID) {
	var xhr = new XMLHttpRequest();
	var url = "http://api.dogest.cn/grade/grade/query?id=" + stuID;
	xhr.onreadystatechange = function (params) {
		console.log("ajax : request status changed : " + xhr.readyState + " : " + xhr.status);
		if (this.readyState == 4 && this.status == 200) {
			// call displayScoreList function
			displayScoreList(JSON.parse(this.responseText));
		}
	}
	xhr.open("GET", url, true);
	xhr.send();
}

window.onload = function (params) {

	// this.alert(getQueryStuID());

	ajax_getStuDataJSON(getQueryStuID());

}