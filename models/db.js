
//var express=('express')


function dbconnection() {
	var mysql = require('mysql');
	var connection = mysql.createConnection({
	  host:'localhost',
	  user:'root',
	  password:'wedisegid',
	  database:'transport'
	});
	connection.connect(function(error) {
		if (!!error) {
		    console.log('Error');
		    return;
		} else {
			console.log('connected');
		}
	})
	return connection;
}

module.exports = new dbconnection();