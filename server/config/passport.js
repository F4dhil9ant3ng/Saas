import passport from 'passport';
import passportJwt from 'passport-jwt';
import localStrategy from 'passport-local';
import User from '../models/user';
import config from './envConfig';

const JwtStrategy = passportJwt.Strategy;
const ExtractJwt = passportJwt.ExtractJwt;
const localOpts = {
		usernameField: 'email'
};

// Local Strategy
const localLogin = new localStrategy(localOpts, (email, password, done) => {
		User.findOne({
				email: email
		}, (err, user) => {
				if (err) {
						return done(err)
				}
				if (!user) {
						return done(null, false, 'User doesnt exist')
				}
				user.comparePassword(password, (err, isMatch) => {
						if (err) 
								return done(err);
						if (!isMatch) {
								done(null, false, 'Password is incorrect')
						} else {
								done(null, user);
						}
				})
		})
})

const jwtOptions = {
		secret: config.secret,
		JwtRequest: ExtractJwt.fromAuthHeaders()
}

// Setup JwtStrategy
const jwtLogin = new JwtStrategy(jwtOptions, (user, done) => {
		User.findById(user._id, (err, user) => {
				if (err) 
						return done(err);
				if (user) {
						return done(null, user);
				} else {
						done(null, false);
				}
		})
})

passport.use(localLogin);
passport.use(jwtLogin);