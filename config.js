/*
module.exports = {
  port: 3000,
  appRoot: __dirname,
  db: {
    connectionLimit: 20,
    host: 'localhost',
    user: 'root',
	port: 3306,
    password: 'zzz',
    database: 'Freelancer',
  },
};
*/
module.exports = {
  port: 3000,
  appRoot: __dirname,
  db: {
    connectionLimit: 20,
    host: 'dbproject.cj5ix5umxarq.ap-northeast-2.rds.amazonaws.com',
    user: 'dbproject',
	port: 3306,
    password: 'epdlxjqpdltm',
    database: 'dbproject',
  },
};

/*
var db_con = mysql.createConnection({
      host: 'dbproject.cj5ix5umxarq.ap-northeast-2.rds.amazonaws.com',
      port: '3306',
      user: 'dbproject',
      password: 'epdlxjqpdltm',
      database: 'dbproject'
      })
*/