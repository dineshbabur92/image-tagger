var mongoose = require("mongoose");

imageTagSchema= {
	"index": {
		"type": "Number"
	},
	"image_url": {
		"type": "String",
		"required": true
	},
	"predefined_tags": [{
    "type": "String"
	}],
	"userdefined_tags": [{
		"type": "String"
	}],
	"status": {
		"type": "Number",
		"required": true
	}
} 

module.exports = new mongoose.Schema(imageTagSchema);

module.exports.imageTagSchema = imageTagSchema;

