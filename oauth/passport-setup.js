const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20')
const User = require('../models/User')
 
passport.serializeUser((user, done) => {
	done(null, user.id)	
})

passport.deserializeUser((id, done) => {
	User.findById(id).then((user) => {
		done(null, user)	
	})
})

passport.use(
	new GoogleStrategy({
	// options for the google strat
	callbackURL: '/auth/google/redirect',
	clientID: process.env.clientID,
	clientSecret: process.env.clientSecret
}, (accessToken, refreshToken, profile, done) => {
	// passport callback function

	User.findOne({googleId:profile.id}).then((currentUser) => {
		if(currentUser){
		// already have a user
		console.log('user is: ' + currentUser)
		done(null, currentUser)
		} else {
			// if not, create user in db
			new User({
			username: profile.displayName,
			googleId: profile.id
		}).save().then((newUser) => {
			console.log('new user created' + newUser)
			done(null, newUser)
		})
	}
		
})
}))
