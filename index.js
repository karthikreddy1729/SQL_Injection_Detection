let mysql = require('mysql');
let connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'nitkfaps1234',
    database: 'security'
});

// load the things we need
var express = require('express');
var app = express();
const { spawn } = require('child_process');
var bodyParser = require("body-parser");
var urlencodedParser = bodyParser.urlencoded({ extended: false })
var jsonParser = bodyParser.json()
// set the view engine to ejs
app.set('view engine', 'ejs');
let { PythonShell } = require('python-shell')
// use res.render to load up an ejs view file
connection.connect(function (err) {
    if (err) {
        return console.error('error: ' + err.message);
    }
    var check = "'ya' OR 1=1"
    connection.query("SELECT * from Persons where username=" + check, function (err, rows, fields) {
        if (!err)
            console.log('Records checking: ', rows);
        else
            console.log('Error Occured.', err);
    });
    console.log('Connected to the MySQL server.');
});

// index page
app.get('/', async function (req, res) {
    const username = 'yash'
    const password = 'yash1234'
    // var dataToSend;
    // // spawn new child process to call the python script
    // const python = await spawn('python', ['ml_detect_sqli.py']);
    // // collect data from script
    // await python.stdout.on('data', function (data) {
    //     console.log('Pipe data from python script ...' + data);
    //     dataToSend = data.toString();
    // });
    // // in close event we are sure that stream from child process is closed
    // python.on('close', (code) => {
    //     console.log(`child process close all stdio with code ${code}`);
    //     // send data to browser
    //     //  res.send(dataToSend)
    // });

    // pyshell.end(function (err, code, signal) {
    //     if (err) throw err;
    //     console.log('The exit code was: ' + code);
    //     console.log('The exit signal was: ' + signal);
    //     console.log('finished');
    // });
    res.render('pages/index', { data: req.body });
});
app.post('/', urlencodedParser, async function (req, res, err) {
    console.log(req.body.username)
    var check = "'ya' OR 1=1"
    var out1
    var out2
    connection.query("SELECT * from Persons where username='" + req.body.username + "'", function (err, rows, fields) {
        if (!err) {
            console.log('Records1: ', rows[0]);
            out1 = rows
        } else
            console.log('Error Occured.', err);
    });
    connection.query('SELECT * from Persons where username=?', [req.body.username], function (err, rows, fields) {
        if (!err)

            console.log('Records2 : ', rows);
        else
            console.log('Error Occured.', err);
    });

    res.render('pages/index', { data: out1 });
})
// about page
app.get('/about', function (req, res) {
    res.render('pages/about', { data: req.body });
});

app.post('/about', urlencodedParser, async function (req, res, err) {
    let options = {
        mode: 'text',
        pythonOptions: ['-u'], // get print results in real-time 
        //scriptPath: 'path/to/my/scripts', //If you are having python_test.py script in same folder, then it's optional. 
        args: [req.body.username] //An argument which can be accessed in the script using sys.argv[1] 
    };
    //let pyshell = new PythonShell('script1.py');
    // await PythonShell.run('ml_detect_sqli.py', null, function (err) {
    //     if (err) throw err;
    //     console.log('finished');
    // });
    var out
    await PythonShell.run('ml_detect_sqli.py', options, function (result, err) {
        // received a message sent from the Python script (a simple "print" statement)
        console.log(result, err);
        out = err[4]
        res.render('pages/about', { data: out });
    });

})


// var dataToSend;
// // spawn new child process to call the python script
// const python = spawn('python', ['ml_detect_sqli.py']);
// // collect data from script
// python.stdout.on('data', function (data) {
//     console.log('Pipe data from python script ...' + data);
//     dataToSend = data.toString();
// });
// // in close event we are sure that stream from child process is closed
// python.on('close', (code) => {
//     console.log(`child process close all stdio with code ${code}`);
//     // send data to browser
//     //  res.send(dataToSend)
// });

app.listen(8080);
console.log('8080 is the magic port');

