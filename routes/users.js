const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const passport = require('passport');
const router = express.Router();

//LOAD USER Model

require('../models/User');
const User = mongoose.model('users');

router.get('/login', (req, res) => {
    res.render('users/login');
});

router.get('/register', (req, res) => {
    res.render('users/register');
});

//LOGIN FORM POST

router.post('/login', (req, res, next) => {
	passport.authenticate('local', {
		successRedirect: '/ideas',
		failureRedirect: '/users/login',
		failureFlash: true
	})(req, res, next);
});


//Register From Post
router.post('/register', (req, res) => {
	let errors = [];   

	if(!req.body.name) {
		errors.push({text:"please enter the name"});
	} else if(!req.body.email) {
		errors.push({text:"please enter the name"});
	} else if(!req.body.password) {
		errors.push({text:"please enter the password"});
	} else if(!req.body.password2) {
		errors.push({text:"please enter the Confirm Password"});
	} else if( req.body.password != req.body.password2) {
		errors.push({text:"Passwords do not match"});
	} else if( req.body.password.length < 4) {
		errors.push({text:"Password must be at least 4 character"});
	}			

	if(errors.length > 0) {
		res.render('users/register', {
			errors: errors,
			name: req.body.title,
			email: req.body.email,
			password: req.body.password,
			password2: req.body.password2
		});
	} else {

		User.findOne({email: req.body.email})
		 .then(user => {
		 	 if(user) {
		 	 	req.flash('error_msg', "Email Id already exists");
				res.redirect('/users/register');
		 	 } else {
		 	 	const newUser = new User({
					name: req.body.name,
					email: req.body.email,
					password: req.body.password			
				});
				bcrypt.genSalt(10, (err, salt) => {
					bcrypt.hash(newUser.password, salt, (err, hash) => {
						if(err) throw err;
						newUser.password = hash;
						newUser.save()
						 .then(user => {
						 	req.flash('success_msg', "User Register Successfully. Loign ....");
							res.redirect('/users/login');
						 })
						 .catch(err => {
						 	console.log(err);
						 	return;
						 });
					});
				});
		 	 }
		});				 
	}	
});

//LOGOUT USER
router.get('/logout', (req, res) => {
	req.logout();
	req.flash('success_msg', 'You are logged out');
	res.redirect('/users/login');
});

module.exports= router;