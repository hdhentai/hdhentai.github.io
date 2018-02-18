<%@ page language="java" contentType="text/html; charset=UTF-8"
    pageEncoding="UTF-8"%>
<%@ page import="java.io.*,java.util.*" %>
<!--設置request對象為utf-8編碼-->
<% request.setCharacterEncoding("UTF-8"); %>

<!DOCTYPE html>
<html lang="en">

<head>
	<title>POST_Form</title>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link href="css/style.css" rel="stylesheet">
</head>

<body>
	<div>
		<form>
			<table border="1px">
				<tr>
					<td colspan="2">由服務端返回表單數據</td>
				</tr>
				<tr>
					<td>用戶名：</td>
					<td><input type="text" name="Uname" value="<%= request.getParameter("Uname") %>" ></td>
				</tr>
				<tr>
					<td>密碼：</td>
					<td><input type="text" name="Pword" value="<%= request.getParameter("Pword") %>"></td>
				</tr>
			</table>
		</form>
	</div>
</body>

</html>