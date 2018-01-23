var express = require("express");
var bodyParser = require("body-parser");
var wagner = require("wagner-core");
var logger = require('morgan');
var fs = require("fs");
var logger = require("morgan");
var winston = require("winston");

var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: true}));

app.use(logger('common', {stream: fs.createWriteStream('./access.log', {flags: 'a'})}))
app.use(logger('dev'));

var winston_logger = winston.createLogger({
  level: 'info',
  format: winston.format.json(),
  transports: [
    //
    // - Write to all logs with level `info` and below to `combined.log` 
    // - Write all logs error (and below) to `error.log`.
    //
    new winston.transports.File({ filename: 'error.log', level: 'error' }),
    new winston.transports.File({ filename: 'combined.log' })
  ]
});
winston_logger.add(new winston.transports.Console({
  format: winston.format.simple()
}));
// winston_logger.log({
//   "level": 'info',
//   "message": 'Hello distributed log files!'
// });
wagner.factory("winston_logger", function(){
	return winston_logger;
});

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