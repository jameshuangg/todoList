var mongoose = require('mongoose');

var TodoSchema = new mongoose.Schema({
	description: String,
	dateCreated: {type: Date, default: Date.now()},
	dueDate: {type: Date, default: Date.now()},
	completed: {type: Boolean, default: false}
});

TodoSchema.methods.updateDesc = function(desc, cb) {
	this.description = desc;
	this.save(cb);
};

mongoose.model('Todo', TodoSchema);