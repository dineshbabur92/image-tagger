var bodyparser = require("body-parser");
var httpstatus = require("http-status");
var express = require("express");
var underscore = require("underscore");


module.exports = function(wagner){

    api = express.Router();

    function logThisToFile(message){
        // logThisToFile("logThisToFile called");
        return wagner.invoke(function(winston_logger){
            // logThisToFile("inside logThisToFile invoke");
            return winston_logger.log({level: "info", "timestamp": (new Date().toString()), message: message}); 
        });
    }
    
    logThisToFile("~~~~~~~~~~~~~~~~~~LOGGING STARTS HERE~~~~~~~~~~~~~~~~~~");
    // logThisToFile("LOG THIS");

    api.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    api.get("/", function(req, res){
        res.sendFile(__dirname + "/client/dist/index.html");
    });
    
    api.get("/:collection", wagner.invoke(function(db){
        return function(req, res){
            const collection = req.params.collection;
            // logThisToFile("==========================================================");
            logThisToFile("==========================================================");
            logThisToFile("getting for collection: " + collection);
            // console.log(db);
            db.models[collection].find({status: 0}).count().exec(function (err, count) {
                // Get a random entry
                console.log("error and count, ", err, count);
                logThisToFile("number of records remaining, " + JSON.stringify(count));
                var random = Math.floor(Math.random() * count)
                logThisToFile("skipping these many records randomly, " + JSON.stringify(random));
                db.models[collection].findOne({status: 0}).skip(random).exec(function(err, doc){
                    if(err){ 
                        logThisToFile("could not fetch one with status 0, err" + JSON.stringify(err));
                        res.json({status: 500, "error": err});
                        return;
                    }
                    logThisToFile("doc being sent: " + JSON.stringify(doc));
                    res.json({"status": 200, "doc": doc}); 
                    logThisToFile("==========================================================");
                });
            });
        }}
    ));

    api.post("/:collection", wagner.invoke(function(db){

        return function(req, res){
            const collection = req.params.collection;
            let docReceived = req.body.doc;
            logThisToFile("==========================================================");
            logThisToFile("posting for collection: " + JSON.stringify(collection));
            logThisToFile("doc to be posted, " + JSON.stringify(docReceived));
            let result = {};
            db.models[collection].findOne({image_url: docReceived.image_url}, function(err, doc){
                if(err || !doc){ 
                    logThisToFile("could not find the document posted, doc: " + JSON.stringify(doc) + JSON.stringify(err));
                    result["status"] = 500;
                    result["error"] = err;
                    return;
                }
                // logThisToFile("results" + JSON.stringify(doc));
                logThisToFile("userdefined_tags, " + JSON.stringify(docReceived["userdefined_tags"]));
                if(doc["status"] == 1 || docReceived.userdefined_tags.length == 0){
                    if(docReceived.userdefined_tags.length == 0){
                        logThisToFile("No user-defined tags");
                        result["message"] = "No tags given!";
                    }
                    else if(doc["status"] = 1){
                        logThisToFile("Already submitted by some other user!");
                        result["message"] = "Already submitted by some other user!";
                    }
                    result["status"] = 200;
                    result["saved_doc"] = undefined;
                    db.models[collection].find({status: 0}).count().exec(function (err, count) {
                        // Get a random entry
                        logThisToFile("number of records remaining, " + count);
                        var random = Math.floor(Math.random() * count)
                        logThisToFile("skipping these many records randomly, " + random);
                        db.models[collection].findOne({status: 0}).skip(random).exec(function(err, doc){
                            if(err){ 
                                logThisToFile("could not fetch one with status 0, err" + JSON.stringify(err));
                                result["error"] = err;
                            }
                            logThisToFile("doc being sent: " + JSON.stringify(doc));
                            result["doc"] = doc;
                            res.json(result);
                            logThisToFile("==========================================================");
                        });
                    });
                }
                else{
                    doc["userdefined_tags"] = docReceived["userdefined_tags"]; //.split(",");
                    doc["status"] = 1;
                    doc.save(function(err, saved_doc){
                        if(err){
                            logThisToFile("Could not save document in post, for, ", JSON.stringify(doc), JSON.stringify(err));
                            result["error"] = err;
                        }
                        result["status"] = 200;
                        result["saved_doc"] = saved_doc;
                        db.models[collection].find({status: 0}).count().exec(function (err, count) {
                        // Get a random entry
                            logThisToFile("number of records remaining, ", count);
                            var random = Math.floor(Math.random() * count)
                            logThisToFile("skipping these many records randomly, ", random);
                            db.models[collection].findOne({status: 0}).skip(random).exec(function(err, doc){
                                if(err){ 
                                    logThisToFile("could not fetch one with status 0, err", JSON.stringify(err));
                                    result["error"] = result["error"] + ",\n" + err.toString();
                                }
                                logThisToFile("doc being sent: ", JSON.stringify(doc));
                                result["doc"] = doc;
                                res.json(result);
                                logThisToFile("==========================================================");
                            });
                        });
                    });

                }
            });

        }}

    ));

    return api;
}
