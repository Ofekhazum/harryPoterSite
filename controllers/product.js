
const { client, dbName } = require('../core/db');
const mongoose = require('mongoose');

const { removeSpaces, getSortQueryCode } = require('../core/util');


exports.getAllProducts = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;

    const limit = parseInt(req.query.limit) || 15;

    const skip = (page - 1) * limit;

    const sortOption = req.query.sort || '';
    
    const price = parseInt(req.query.price) || 500;

    const category = req.query.category || '';
    
    let sort = getSortQueryCode(sortOption);
    
    let filter = { price: { $lte: price } };

    if (category) {
      filter.category = category;
    }

    const database = client.db(dbName);

    const products = database.collection('products');
    
    const totalProducts = await products.countDocuments(filter);
    
    const totalPages = Math.ceil(totalProducts / limit);
    
    const cursorProducts = products.find(filter).sort(sort).skip(skip).limit(limit);
    
    const allProducts = await cursorProducts.toArray();

    res.render('products-catalog', {
      products: allProducts,
      currentPage: page,
      totalPages,
      limit,
      sort: sortOption,
      category,
      price,
      user: req.user 
    });

} catch (err) {
    console.error('Error fetching data:', err);
    res.status(500).send('Internal Server Error');
  }
}

exports.getProductById = async (req, res) => {
  try {

    const database = client.db(dbName);

    const products = database.collection('products');

    const productId = req.params.id;

    const itemId = removeSpaces(productId);

     const cursor = products.find({ item_id: itemId});

     const allProducts = await cursor.toArray();

     const [product] = allProducts;

    
    if (!product) {
      return res.status(404).send('Product not found');
    }
    res.render('product', { product, user: {id:23} });
  } catch (err) {
    console.error('Error fetching product:', err);
    res.status(500).send('Internal Server Error');
  }
};


exports.getProductsWishlist = async (wishlist) => {
  try {

    const database = client.db(dbName);

    const productsCollection = database.collection('products');

    const wishlistIds = wishlist.map(id => new mongoose.Types.ObjectId(id));
  
    const products = productsCollection.find({ _id: { $in: wishlistIds } });

    const allProducts = await products.toArray();

    return allProducts;
  } catch (err) {
    console.error('Error fetching wishlist products:', err);
    res.status(500).send('Internal Server Error');
  }
};