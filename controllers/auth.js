
const {User} = require('../models/user');
const passport = require('passport');

const { client, dbName } = require('../core/db');


exports.getSignupPage = (req, res) => {
  res.render('signup');
};

exports.postSignup = async (req, res, next) => {
  try {
    const { first_name, last_name, email, password, date_of_birth, street, city, state, postal_code, gender } = req.body;

    const newUser = new User({
      first_name,
      last_name,
      email,
      password,
      date_of_birth,
      address: {
        street,
        city,
        state,
        postal_code,
      },
      gender,
      user_type: 'Regular',
    });

    const database = client.db(dbName);

    const users = database.collection('users');

    await users.insertOne(newUser);

    // await newUser.save();

    res.render('login');

    // req.login(newUser, (err) => {
    //     if (err) {
    //       return next(err);
    //     }
    //     console.log('User signed up successfully - in the login step: ', newUser);
    //     // Simulate login after successful signup
    //     req.body.email = email;
    //     req.body.password = password;
    //     this.postLogin(req, res, next);
    //   });
    } catch (err) {
      console.error('Error during sign-up:', err);
      res.status(500).send('Internal Server Error');
    }
};

exports.getLoginPage = (req, res) => {
  res.render('login');
};

exports.postLogin = (req, res, next) => {
  passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true,
  })(req, res, next);
};

exports.logout = (req, res) => {
  req.logout(() => {
    res.redirect('/login');
  });
};
