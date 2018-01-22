var bodyparser = require("body-parser");
var httpstatus = require("http-status");
var express = require("express");
var underscore = require("underscore");


module.exports = function(wagner){

    api = express.Router();

    api.use(function(req, res, next) {
      res.header("Access-Control-Allow-Origin", "*");
      res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
      next();
    });

    api.get("/", function(req, res){
        res.sendFile(__dirname + "/client/dist/index.html");
    });
    
    api.get("/:collection", wagner.invoke(function(eyes){

        return function(req, res){
            const collection = req.params.collection;
            console.log("getting for collection: ", collection);
            eyes.findOne({status: 0}, function(err, doc){
                if(err){ 
                    console.log("could not fetch one with status 0, err", err);
                    res.json({status: 500, "error": err});
                    return;
                }
                console.log("results", doc);
                // doc["status"] = 2;
                // doc.save(function(err, result){
                //     if(err){
                //         console.log("Could not change status for the doc, to pending for, ", doc, err);
                //         res.json({status: 500, "error": err});
                //         return;
                //     }
                //     res.json({"status": 200, "doc": doc}); 
                // })
                res.json({"status": 200, "doc": doc}); 
            });

        }}

    ));

    api.post("/:collection", wagner.invoke(function(eyes){

        return function(req, res){
            const collection = req.params.collection;
            let docReceived = req.body.doc;
            console.log("posting for collection: ", collection);
            // console.log("doc to be posted, ", docReceived);
            eyes.findOne({image_url: docReceived.image_url}, function(err, doc){
                if(err){ 
                    console.log("could not find the document posted, doc: ", doc, err);
                    res.json({status: 500, "error": err});
                    return;
                }
                if(!doc){
                    console.log("could not find the document posted, doc: ", doc, err);
                    res.json({status: 500, "error": err});
                    return;
                }
                // console.log("results", doc);
                // console.log("userdefined_tags, ", docReceived["userdefined_tags"]);
                doc["userdefined_tags"] = docReceived["userdefined_tags"].toString().split(","); //.split(",");
                doc["status"] = 0;
                doc.save(function(err, result){
                    if(err){
                        console.log("Could not save document in post, for, ", doc, err);
                        res.json({status: 500, "error": err});
                        return;
                    }
                    eyes.findOne({status: 0}, function(err, doc){
                        if(err){ 
                            console.log("could not fetch one with status 0, err", err);
                            res.json({status: 500, "error": err});
                            return;
                        }
                        console.log("results", doc);
                        // doc["status"] = 2;
                        // doc.save(function(err, result){
                        //     if(err){
                        //         console.log("Could not change status for the doc, to pending for, ", doc, err);
                        //         res.json({status: 500, "error": err});
                        //         return;
                        //     }
                        //     res.json({"status": 200, "doc": doc}); 
                        // })
                        res.json({"status": 200, "doc": doc}); 
                    });
                });
            });

        }}

    ));

    return api;
}
