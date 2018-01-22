var express = require("express");
var bodyParser = require("body-parser");
var wagner = require("wagner-core");
var logger = require('morgan');
var fs = require("fs");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

wagner.factory("app", function(){
	return app;
});

require("./models")(wagner);

app.use("/client/dist", express.static(__dirname + "/client/dist")) ;
app.use("/", require("./api")(wagner));

app.use(function (err, req, res, next) {
  if(err){
    res.json({"error": err});
  }
});
process.on('uncaughtException', function(err) {
  console.log('Caught exception: ' + err);
});


var server = app.listen(8080);
server.timeout = 1000000000;
console.log("app listening in 8080!");