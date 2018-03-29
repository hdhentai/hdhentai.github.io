window.onload = function () {

    // this.alert("123");

    var xhr = new XMLHttpRequest();
    var url = "";
    url = "http://api.dogest.cn/grade/grade/query?id=15110572122";
    url = "http://hen-tai.top:23333/SDUT.GPA/15110572122.SDUTStudentScoreDataJSONString?function_callBack=callBackFunction_GET_jsonData&stuID=15110572122";
    xhr.onreadystatechange = function () {
        console.log("请求状态改变:" + xhr.readyState + ":" + xhr.status);
        if (xhr.readyState == 4 && xhr.status == 200) {
            console.log(JSON.parse(xhr.responseText));
        }
    }
    xhr.open("GET", url, true);
    xhr.send();

}