var mongoose = require('mongoose');
var ServerApiVersion = require('mongodb');
var dbURI = 'mongodb://localhost:27017/passport-auth';

if (process.env.NODE_ENV === 'production'){
	dbURI = process.env.MONGODB_URI;
} 

mongoose.connect(dbURI, {
	useNewUrlParser: true,
	useUnifiedTopology: true,
	serverApi: ServerApiVersion.v1
});

/* Event Listeners */
mongoose.connection.on('connected', function(){
	console.log('Mongoose connected to ' + dbURI + ' & NODE_ENV is ' + process.env.NODE_ENV);
});

mongoose.connection.on('error', function(err){
	console.log("Mongoose error: " + err);
});

mongoose.connection.on('disconnected', function(){
	console.log('Mongoose disconnected');
});

// Close connection to database, display mesage as to why the connection was closed,
// and call callback to terminate the process manually
var gracefulShutdown = function(msg, callback){
	mongoose.connection.close(function(){
		console.log('Mongoose disconnected from ' + msg);
		callback();
	});
};


// Event emmited on app termination locally
process.on('SIGINT', function(){
	gracefulShutdown('app termination', function(){
		process.exit(0);
	});
});

// Event emmited on app shutdown via heroku
process.on('SIGTERM', function(){
	gracefulShutdown('Heroku app shutdown', function(){
		process.exit(0);
	});
});

// Require schemas
require('./User');

