
const { client, dbName } = require('../core/db');
const LocalStrategy = require('passport-local').Strategy;
const { comparePassword} = require('../models/user');
const mongoose = require('mongoose');

module.exports = (passport) => {
  passport.use(
    new LocalStrategy({ usernameField: 'email' }, async (email, password, done) => {
      try {
        const database = client.db(dbName);

        const users = database.collection('users');
    
        const user = await users.findOne({ "email": email});

        if (!user) {
          return done(null, false, { message: 'No user with that email' });
        }
        const isMatch = await comparePassword(password, user.password);

        if (!isMatch) {
          return done(null, false, { message: 'Password incorrect' });
        }
        return done(null, user);
      } catch (err) {
        return done(err);
      }
    })
  );

  passport.serializeUser((user, done) => {
    console.log("serialize User: ", user);
    done(null, {...user, id: user._id  });
  });

  passport.deserializeUser(async ({id}, done) => {
    try {
        
        const database = client.db(dbName);

        const users = database.collection('users');
    
        const userId = new mongoose.Types.ObjectId(id);

        const user = await users.findOne({ "_id": userId});
      
        done(null, user);

    } catch (err) {
      done(err, false);
    }
  });
};
