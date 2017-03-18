var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var passport = require('passport');
var jwt = require('express-jwt');

var Todo = mongoose.model('Todo');
var User = mongoose.model('User');

var auth = jwt({secret: 'SECRET', userProperty: 'payload'});

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

/***************************************************************************
	Route: /register
***************************************************************************/
router.post('/register', function(req, res, next) {
	if(!req.body.username || !req.body.password) {
		return res.status(400).json({message: "Please fill out all the fields."});
	}
	
	var user = new User();
	user.username = req.body.username;
	user.setPassword(req.body.password);
	
	user.save(function(err) {
		if(err) {return next(err);}
		return res.json({token: user.generateJWT()})
	});
	
});

/***************************************************************************
	Route: /login
***************************************************************************/
router.post('/login', function(req, res, next) {
	if(!req.body.username || !req.body.password) {
		return res.status(400).json({message: "Please fill out all fields."});
	}
	
	passport.authenticate('local', function(err, user, info) {
		if(err) {return next(err);}
		
		if(user) {
			res.json({token: user.generateJWT()})
		} else {
			res.status(401).json(info);
		}
	})(req, res, next);
});

/***************************************************************************
	Route: /todos
***************************************************************************/
router.route('/todos')
	/**
		Method: GET

		Desc: When a get request is made to the /todos endpoint, the endpoint returns all Todo models in our local database to the response object.
	**/
	.get(function(req, res, next) {
		Todo.find(function(err, todos) {
			if(err) {
				return next(err);
			}
			res.json(todos);
		});
	})

	/**
		Method: POST

		Desc: When a post request is made to the /todos endpoint, the endpoint saves the new todo to our database and returns it to the response object.
	**/
	.post(auth, function(req, res, next) {
		var todo = new Todo(req.body);

		todo.save(function(err, todo) {
			if(err) {
				return next(err);
			}
			res.json(todo);
		});
	});

/*--------------------------------------------------------------------------
	Method: Param
	
	Desc: For routes that require us to load a specific todo by id. We can use express' param() function to preload this data to the req object.
--------------------------------------------------------------------------*/

router.param('todo', function(req, res, next, id) {
	var query = Todo.findById(id);
	
	query.exec(function(err, todo) {
		if(err) {
			return next(err);
		}
		if(!todo) {
			return next(new Error('can\'t find todo'));
		}
		req.todo = todo;
		return next();
	});
});



/***************************************************************************
	Route: /todos/:todo
***************************************************************************/
router.route('/todos/:todo')
	/**
		Method: GET

		Desc: When a put request is made to a specific /todos/:todo endpoint, the endpoint edits the todo in our database and returns the updated post.
	**/
	.get(auth, function(req, res, next) {
		res.json(req.todo);
	})

	/**
		Method: PUT

		Desc: When a put request is made to a specific /todos/:todo endpoint, the endpoint edits the todo in our database and returns the updated post.
	**/
	.put(auth, function(req, res, next) {
		req.todo.updateDesc(req.body.description, function(err, todo) {
			if(err) {
				return next(err);
			}

			res.json(todo);
		});
	})

	/**
		Method: DELETE

		Desc: When a delete request is made to a specific /todos/:todo endpoint, the endpoint deletes the todo in our database.
	**/
	.delete(auth, function(req, res, next) {
		Todo.remove({
			_id: req.todo._id
		}, function(err, todo) {
			if(err) {
				return next(err);
			}
			res.json({message: "Todo successfully removed."});
		})
	});


module.exports = router;
