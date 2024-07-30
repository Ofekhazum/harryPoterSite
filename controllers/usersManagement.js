
const { client, dbName } = require('../core/db');
const User = require('../models/user');
const mongoose = require('mongoose');

exports.getUserManagement = async (req, res) => {

  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    const skip = (page - 1) * limit;

    const database = client.db(dbName);
    const usersCollection = database.collection('users');

    const totalUsers = await usersCollection.countDocuments();
    const totalPages = Math.ceil(totalUsers / limit);

    const users = await usersCollection.find().skip(skip).limit(limit).toArray();

    res.render('users-management', { 
        users, 
        user: req.user, 
        currentPage: page, 
        totalPages,
        limit,
      });

  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.addUser = async (req, res) => {
  try {
    const { first_name, last_name, email, password, date_of_birth, street, city, state, postal_code, gender, user_type } = req.body;
    const newUser = {
      first_name,
      last_name,
      email,
      password,
      date_of_birth,
      address: { street, city, state, postal_code },
      gender,
      user_type
    };

    const database = client.db(dbName);
    const usersCollection = database.collection('users');

    await usersCollection.insertOne(newUser);

    res.redirect('/users-management');
  } catch (err) {
    console.error('Error adding user:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const { first_name, last_name, email, date_of_birth, street, city, state, postal_code, gender, user_type } = req.body;

    const updatedUser = {
      first_name,
      last_name,
      email,
      date_of_birth,
      address: { street, city, state, postal_code },
      gender,
      user_type
    };

    const database = client.db(dbName);
    const usersCollection = database.collection('users');

    await usersCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(userId) },
      { $set: updatedUser }
    );

    res.redirect('/users-management');
  } catch (err) {
    console.error('Error updating user:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteUser = async (req, res) => {
    try {
      const userId = req.params.id;

      console.log("userId: ", userId);
  
      const database = client.db(dbName);
      const usersCollection = database.collection('users');
  
      await usersCollection.deleteOne({ _id: new mongoose.Types.ObjectId(userId) });
  
      res.redirect('/users-management');
    } catch (err) {
      console.error('Error deleting user:', err);
      res.status(500).send('Internal Server Error');
    }
  };
