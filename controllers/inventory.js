const { client, dbName } = require('../core/db');
const { isJsonString } = require('../core/util');
const mongoose = require('mongoose');


exports.getInventory = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = 15;
    const skip = (page - 1) * limit;

    const database = client.db(dbName);
    const productsCollection = database.collection('products');

    const totalProducts = await productsCollection.countDocuments();
    const totalPages = Math.ceil(totalProducts / limit);

    const products = await productsCollection.find().skip(skip).limit(limit).toArray();


    res.render('inventory', { 
        products, 
        user: req.user, 
        currentPage: page, 
        totalPages 
      });
  } catch (err) {
    console.error('Error fetching inventory:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.addProduct = async (req, res) => {
  try {
    const { item_id, item_name, item_description, category, subcategory, price, quantity_in_stock, image_url } = req.body;

    const newProduct = {
      item_id,
      item_name,
      item_description,
      category,
      subcategory: isJsonString(subcategory) ? JSON.parse(subcategory) : subcategory,
      price: parseFloat(price),
      quantity_in_stock: parseInt(quantity_in_stock),
      image_url
    };

    const database = client.db(dbName);
    const productsCollection = database.collection('products');

    await productsCollection.insertOne(newProduct);

    res.redirect('/inventory');
  } catch (err) {
    console.error('Error adding product:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const productId = req.params.id;
    const { item_id, item_name, item_description, category, subcategory, price, quantity_in_stock, image_url } = req.body;

    const updatedProduct = {
        item_id,
        item_name,
        item_description,
        category,
        subcategory: isJsonString(subcategory) ? JSON.parse(subcategory) : subcategory,
        price: parseFloat(price),
        quantity_in_stock: parseInt(quantity_in_stock),
        image_url
      };

    const database = client.db(dbName);
    const productsCollection = database.collection('products');

    await productsCollection.updateOne({ _id:  new mongoose.Types.ObjectId(productId) }, { $set: updatedProduct });
    

    res.redirect('/inventory');
  } catch (err) {
    console.error('Error updating product:', err);
    res.status(500).send('Internal Server Error');
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const productId = req.params.id;

    const database = client.db(dbName);
    const productsCollection = database.collection('products');

    await productsCollection.deleteOne({ _id: new mongoose.Types.ObjectId(productId) });

    res.redirect('/inventory');
  } catch (err) {
    console.error('Error deleting product:', err);
    res.status(500).send('Internal Server Error');
  }
};
