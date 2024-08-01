
const { client, dbName } = require('../core/db');
const mongoose = require('mongoose');


exports.getProfile = (req, res) => {
  res.render('profile', { user: req.user });
};

exports.updateProfile = async (req, res) => {
  try {
    const { first_name, last_name, email, date_of_birth, street, city, state, postal_code, gender } = req.body;

    const updatedUser = {
      first_name,
      last_name,
      email,
      date_of_birth,
      address: {
        street,
        city,
        state,
        postal_code,
      },
      gender,
    };

    const database = client.db(dbName);

    const users = database.collection('users');

    let filter = { email: email };

    await users.findOneAndUpdate(filter, { $set: updatedUser });

    const updatedUserFromDb = await users.findOne(filter);

    req.session.passport.user = {
      _id: updatedUserFromDb._id,
      first_name: updatedUserFromDb.first_name,
      last_name: updatedUserFromDb.last_name,
      email: updatedUserFromDb.email,
      date_of_birth: updatedUserFromDb.date_of_birth,
      address: updatedUserFromDb.address || {},
      gender: updatedUserFromDb.gender,
      user_type: updatedUserFromDb.user_type,
    };
    res.render('profile', { user: req.session.passport.user });
    
  } catch (err) {
    console.error('Error updating profile:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.getOrdersHistoryPage = async (req, res) => {
  try {
    const userId = req.user._id;

    const database = client.db(dbName);
    const ordersCollection = database.collection('orders');
    const productsCollection = database.collection('products');

    const orders = await ordersCollection.find({ customerId: userId }).toArray();

    for (let order of orders) {
      const productIds = order.itemIds.map(({ productId }) => new mongoose.Types.ObjectId(productId));

      const products = await productsCollection.find({ _id: { $in: productIds } }).toArray();

      order.products = products.map(product => {
        const item = order.itemIds.find(({ productId }) => productId === product._id.toString());
        return {
          ...product,
          quantity: item.quantity
        };
      });
    }

    res.render('orders-history', { orders, user: req.user });
  } catch (err) {
    console.error('Error fetching order history:', err);
    res.status(500).send('Internal Server Error');
  }
};


exports.getOrdersHistoryPagAsAdmin = async (req, res) => {
  try {

    const userId = req.params.id;

    const database = client.db(dbName);
    const ordersCollection = database.collection('orders');
    const productsCollection = database.collection('products');
    const usersCollection = database.collection('users');

    const user = await usersCollection.findOne({ _id: new mongoose.Types.ObjectId(userId) });


    const orders = await ordersCollection.find({ customerId: userId }).toArray();

    for (let order of orders) {
      const productIds = order.itemIds.map(({ productId }) => new mongoose.Types.ObjectId(productId));

      const products = await productsCollection.find({ _id: { $in: productIds } }).toArray();

      order.products = products.map(product => {
        const item = order.itemIds.find(({ productId }) => productId === product._id.toString());
        return {
          ...product,
          quantity: item.quantity
        };
      });
    }

    res.render('admin-orders-history', { orders, user});
  } catch (err) {
    console.error('Error fetching order history:', err);
    res.status(500).send('Internal Server Error');
  }
};

