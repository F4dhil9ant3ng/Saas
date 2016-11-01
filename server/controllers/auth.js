import jwt from 'jsonwebtoken';
import User from '../models/user';
import config from '../config/envConfig.js';


// Set user information 
const setUserInfo = (req) => ({
	id: req._id,
	email: req.email,
	firstname: req.profile.firstname,
	lastname: req.profile.lastname,
	role: req.role
});

// Generate token function
const generateToken = (user) => {
	return jwt.sign(user.id, config.secret, {
		expiresIn: '1680h'
	})
};

// Login route
export const login = (req, res, next) => {
	const user = setUserInfo(req.user);
	res.status(200).json({
		token: generateToken(user),
		user
	})
}

// Register route
export const register = (req, res, next) => {  
  // Check for registration errors
	
  const email = req.body.email;
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const password = req.body.password;
  // Return error if no email provided
  if (!email) {
    return res.status(422).send({ error: 'You must enter an email address.'});
  }

  // Return error if full name not provided
  if (!firstName || !lastName) {
    return res.status(422).send({ error: 'You must enter your full name.'});
  }

  // Return error if no password provided
  if (!password) {
    return res.status(422).send({ error: 'You must enter a password.' });
  }
  User.findOne({ email: email }, (err, existingUser) => {
      if (err) { return next(err); }

      // If user is not unique, return error
      if (existingUser) {
        return res.status(422).send({ error: 'That email address is already in use.' });
      }

      // If email is unique and password was provided, create account
      const user = new User({
        email: email,
        password: password,
        profile: { firstName: firstName, lastName: lastName }
      });

      user.save((err, user) => {
        if (err) { return next(err); }

        // Subscribe member to Mailchimp list
        // mailchimp.subscribeToNewsletter(user.email);

        // Respond with JWT if user was created

        const userData = setUserInfo(user);
        res.status(201).json({
          token: generateToken(userData),
          user: userData
        });
      });
  });
}

// Role authorization Check

export const roleAuthorization = (role) => {
	return (req, res, next) => {
		const userData = req.user;
		User.findById(userData._id, (err, user) => {
			if(err) {
				res.status(422).json({error: 'No user was found'})
				return next(err);
			}
			if(user.role === role){
				next();
			} else{
				res.status(401).json({ error: 'Unauthorized user'});
				return next('Unauthorized')
			}
		})
	}
}