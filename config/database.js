let mysql = require("mysql");

let connection = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  port: 3307,
  database: "pemrograman_iot",
});

connection.connect(function (err) {
  if (!!err) {
    console.log(err);
  } else {
    console.log("Connected");
  }
});

module.exports = connection;