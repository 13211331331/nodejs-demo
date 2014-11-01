var express = require('express');
var mysql = require('mysql');
var app = express();

app.use(function (req, res, next) {
    console.log('%s %s', req.method, req.url);
    next();
});

var conn = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    database: 'myweb',
    password: 'hanlin',
    port: 3306
});

conn.connect();
app.get('/', function (req, res) {

    conn.query('SELECT * from users', function (err, rows, fields) {
        if (err) throw err;
        var data = '';
        for (var i = 0; i < rows.length; i++) {
            data += '<p>' + 'ID：' + rows[i].id + '</p>';
            data += '<p>' + 'title：' + rows[i].userName + '</p>';
            data += '<p>' + 'contents：' + rows[i].password + '</p>';
            data += '<hr>';
        }
        res.send(data);

    });
});

var TEST_TABLE = 'test';
var TEST_DATABASE = 'nodejs_mysql_tablename';

app.get('/create_database', function (req, res) {
    conn.query('CREATE DATABASE ' + TEST_DATABASE, function (err) {
        if (err && err.number != Client.ERROR_DB_CREATE_EXISTS) {
            throw err;
        }
        conn.query('USE ' + TEST_DATABASE);
        res.send("create table sussess!" + TEST_DATABASE);
    });
});


app.get('/create_table', function (req, res) {
    conn.query('USE ' + TEST_DATABASE);
    conn.query(
        'CREATE TABLE ' + TEST_TABLE +
            '(id INT(11) AUTO_INCREMENT, ' +
            'title VARCHAR(255), ' +
            'text TEXT, ' +
            'created DATETIME, ' +
            'PRIMARY KEY (id))'
    );
    res.send("susee");
});

app.get('/insert', function (req, res) {
    conn.query('USE ' + TEST_DATABASE);
    conn.query(
        'INSERT INTO ' + TEST_TABLE + ' ' +
            'SET title = ?, text = ?, created = ?',
        ['super cool', 'this is a nice text', '2010-08-16 10:00:23']
    );

    conn.query(
        'INSERT INTO ' + TEST_TABLE + ' ' +
            'SET title = ?, text = ?, created = ?',
        ['another entry', 'because 2 entries make a better test', '2010-08-16 12:42:15']
    );
    res.send("susee");
});

app.get('/select', function (req, res) {
    conn.query('USE ' + TEST_DATABASE);
    conn.query(
        'SELECT * FROM ' + TEST_TABLE,
        function selectCb(err, results, fields) {
            if (err) {
                throw err;
            }

            console.log(results);
            console.log(fields);
            conn.end();
        }
    );
    res.send("susee");
});

app.listen(3000);

console.log('Listening on port 3000');
