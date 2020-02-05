var mysql = require('mysql');//引入数据库mysql

//const connection = mysql.createConnection({
//host     : '127.0.0.1',
//user     : 'root',
//password : '123456',
//database : 'mydb'
//});

const connection = mysql.createConnection({
  host     : '101.132.72.39',
  user     : 'root',
  password : 'D0ng1in6750',
  database : 'jiaoyiyou'
});


//连接数据库
connection.connect()

//connection.query('SELECT * FROM user where id=1', function (error, results, fields) {
//if (error) throw error;
//console.log('The solution is: ', results);
//});

module.exports = connection;

