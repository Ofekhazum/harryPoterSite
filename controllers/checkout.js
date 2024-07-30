
const Order = require('../models/order');
const OrderStats = require('../models/orderStats');
const mongoose = require('mongoose');
const { getProductsWishlist } = require('../controllers/product');
const { client, dbName } = require('../core/db');

const getCheckoutPage = async (req, res) => {
    const cartItems = req.session.cart || [];
    const productIds = cartItems.map(item => new mongoose.Types.ObjectId(item.productId));
    const products = await getProductsWishlist(productIds);

    // Add quantity to each product
    const productsWithQuantity = products.map(product => {
      const cartItem = cartItems.find(item => item.productId === product._id.toString());
      return {
        ...product,
        quantity: cartItem ? cartItem.quantity : 0,
      };
    });

    const totalItems = productsWithQuantity.length;
    const totalPrice = productsWithQuantity.reduce((acc, product) => acc + (product.price * product.quantity), 0);

    res.render('checkout', { cart: productsWithQuantity, totalItems, totalPrice, user: req.user });
}



const postNewOrder = async (req, res) => {
    try {
      const { street, city, state, zip, orderNotes } = req.body;
      const customerId = req.user._id;
      const cartItems = req.session.cart || [];
      const itemIds = cartItems.map(item => ({
        productId: item.productId,
        quantity: item.quantity
      }));
      const orderTotal = cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
      const numberOfItems = cartItems.length;
  
      const newOrder = new Order({
        orderId: new mongoose.Types.ObjectId().toString(),
        customerId,
        shippingAddress: { street, city, state, zip },
        orderTotal,
        numberOfItems,
        orderNotes,
        itemIds
      });
  
      const database = client.db(dbName);
      const ordersCollection = database.collection('orders');
      const productsCollection = database.collection('products');
      const orderStatsCollection = database.collection('orderStats');
  
      await ordersCollection.insertOne(newOrder);
  
      // Update Product Quantity
      for (const item of cartItems) {
        await productsCollection.updateOne(
          { _id: new mongoose.Types.ObjectId(item.productId) },
          { $inc: { quantity_in_stock: -item.quantity } }
        );
      }
  
      // Update Order Stats
      let orderStats = await orderStatsCollection.findOne();
  
      if (!orderStats) {
        orderStats = new OrderStats();
      }
  
      orderStats.totalRevenue = (orderStats.totalRevenue || 0) + orderTotal;
      orderStats.totalOrders = (orderStats.totalOrders || 0) + 1;
      orderStats.totalItemsSold = (orderStats.totalItemsSold || 0) + numberOfItems;
  
      for (const item of cartItems) {
          
        const productStatIndex = orderStats.productSales.findIndex(ps => ps.productId === item.productId);
  
        if (productStatIndex > -1) {
          orderStats.productSales[productStatIndex].quantitySold += item.quantity;
          orderStats.productSales[productStatIndex].totalRevenue += item.quantity * item.price;
        } else {
          orderStats.productSales.push({
            productId: item.productId,
            quantitySold: item.quantity,
            totalRevenue: item.quantity * item.price
          });
        }
  
        const categoryStatIndex = orderStats.categorySales.findIndex(cs => cs.category === item.category);
  
        if (categoryStatIndex > -1) {
          orderStats.categorySales[categoryStatIndex].quantitySold += item.quantity;
          orderStats.categorySales[categoryStatIndex].totalRevenue += item.quantity * item.price;
        } else {
          orderStats.categorySales.push({
            category: item.category,
            quantitySold: item.quantity,
            totalRevenue: item.quantity * item.price
          });
        }
      }
  
      // Use upsert to ensure the document is created if it does not exist
      await orderStatsCollection.updateOne(
        {},
        { $set: orderStats },
        { upsert: true }
      );
  
      req.session.cart = [];
  
      res.redirect('/orders-history');
    } catch (err) {
      console.error('Error during checkout:', err);
      res.status(500).send('Internal Server Error');
    }
  };
  

module.exports = { getCheckoutPage, postNewOrder };
