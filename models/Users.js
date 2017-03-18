var mongoose = require('mongoose');
// Used to encrypt the password
var crypto = require('crypto');
// Used to generate session tokens
var jwt = require('jsonwebtoken');

var UserSchema = mongoose.Schema({
	username: {type: String, lowercase: true, unique: true},
	hash: String,
	salt: String
});

UserSchema.methods.setPassword = function(password) {
	this.salt = crypto.randomBytes(16).toString('hex');
	
	this.hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
};

UserSchema.methods.validPassword = function(password) {
	var hash = crypto.pbkdf2Sync(password, this.salt, 1000, 64).toString('hex');
	
	return this.hash === hash;
};

UserSchema.methods.generateJWT = function() {
	// Set token expiration to 60 days
	var today = new Date;
	var exp = new Date(today);
	exp.setDate(today.getDate() + 60);
	
	//jwt is used to generate session tokens
	return jwt.sign({
		_id: this._id,
		username: this.username,
		exp: parseInt(exp.getTime() / 1000)
	}, 'SECRET');
};

mongoose.model('User', UserSchema);