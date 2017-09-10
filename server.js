const express = require('express');
const app = express();

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/dist/');
});

app.get('/:name', function (req, res) {
    res.sendFile(__dirname + '/dist/' + req.params.name);
});


app.listen(80, function () {
    console.log('App listening on port 80!');
});