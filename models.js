var mongoose = require("mongoose");
var _ = require("underscore");

module.exports = function(wagner){
	console.log(process.env["MONGO_DB_URL"]);
	mongoose.connect("mongodb://localhost/revlon", { "useMongoClient": true });
	wagner.factory("db", function(){	
		return mongoose;
	});

	let models = {};
	let modelsToBeCreated = ["tools", "eyes", "face", "hair", "lips", "nail", "skin"]
	for(var index in modelsToBeCreated){
		models[modelsToBeCreated[index]] =  mongoose.model(
			modelsToBeCreated[index], 
			require("./image-tag-schema"), 
			modelsToBeCreated[index]);
	}

	_.each(models, function(value, key){
		wagner.factory(key, function(){
			return value;
		});
	});

	return models;
}