require('dotenv').config(); 

const host = process.env.DB_HOST;
const user = process.env.DB_USER; 
const password = process.env.DB_PASSWORD; 
const database = process.env.DB_DATABASE;

// config/db.config.js
const mysql = require('mysql');

const dbConfig = {
  host: host,
  user: user,
  password: password,
  database: database
};

const connection = mysql.createConnection(dbConfig);

connection.connect((err) => {
  if (err) throw err;
  console.log('Connected to the MySQL database.');
});

module.exports = connection;