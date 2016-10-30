import mongoose from 'mongoose';
import bcrypt from 'nodejs-bcrypt';

const UserSchema = mongoose.Schema({
	email: {
		type: String,
		required: true,
		unique: true,
		lowercase: true
	},
	password: {
		type: String,
		required: true
	},
	profile: {
		firstName: {type: String},
		lastName: {type: String}
	},
	role: {
		type: String,
		enum: ['Crew', 'Captain', 'Coach'],
		default: 'Crew' 
	}
	resetPasswordToken: {type: String},
	resetPasswordExpires: {type: Date}
},{
	timestamps: true
})

UserSchema.pre('save', (next) => {
	const user = this;
	SALT = 5;
	if(!user.isModified('password')) next();
	bcrypt.genSalt(SALT, (err, salt) => {
		if (err) next(err);
		bcrypt.hash(user.password, salt, null, (err, hash) => {
			if(err) next(err);
			user.password = hash;
			next();
		})
	})
});

UserSchema.methods.validPassword = (password) => {
    return bcrypt.compareSync(password, this.password);
}