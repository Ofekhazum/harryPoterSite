
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


const updateProductsQuantity = async (productItems) => {
  const database = client.db(dbName);
  const productsCollection = database.collection('products');

  for (const item of productItems) {
    await productsCollection.updateOne(
      { _id: new mongoose.Types.ObjectId(item.productId) },
      { $inc: { quantity_in_stock: -item.quantity } }
    );
  }

}



const postNewOrder = async (req, res) => {
    try {
      const { street, city, state, zip, orderNotes, phone, country, phonePrefix } = req.body;
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
        shippingAddress: { street, city, state, zip, phone:`${phonePrefix}${phone}`, country },
        orderTotal,
        numberOfItems,
        orderNotes,
        itemIds,
        orderDate: new Date(),
      });
  
      const database = client.db(dbName);
      const ordersCollection = database.collection('orders');
  
      await ordersCollection.insertOne(newOrder);

      await updateProductsQuantity(itemIds);

      await updateOrderStats({ 
        region:country, orderDate: new Date(), cartItems,
         orderTotal, numberOfItems });
      
      req.session.cart = [];
  
      res.redirect('/orders-history');
    } catch (err) {
      console.error('Error during checkout:', err);
      res.status(500).send('Internal Server Error');
    }
  };

async function updateOrderStats(orderDetails) {
  const { region, orderDate, cartItems, orderTotal, numberOfItems } = orderDetails;

  const database = client.db(dbName);

  const orderStatsCollection = database.collection('orderStats');

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
        productName: item.productName,
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

  const dailyRevenue = orderStats.dailyRevenue.find(dr => dr.date.toISOString().split('T')[0] === orderDate);
  if (dailyRevenue) {
    dailyRevenue.revenue += orderTotal;
  } else {
    orderStats.dailyRevenue.push({ date: new Date(orderDate), revenue: orderTotal });
  }

  const month = orderDate.toISOString().slice(0, 7);
  const monthlyRevenue = orderStats.monthlyRevenue.find(mr => mr.month === month);
  if (monthlyRevenue) {
    monthlyRevenue.revenue += orderTotal;
  } else {
    orderStats.monthlyRevenue.push({ month, revenue: orderTotal });
  }


  const year = parseInt(orderDate.toISOString().slice(0, 4), 10);
  const yearlyRevenue = orderStats.yearlyRevenue.find(yr => yr.year === year);
  if (yearlyRevenue) {
    yearlyRevenue.revenue += orderTotal;
  } else {
    orderStats.yearlyRevenue.push({ year, revenue: orderTotal });
  }


  const regionalSale = orderStats.regionalSales.find(rs => rs.region === region);
  if (regionalSale) {
    regionalSale.revenue += orderTotal;
  } else {
    orderStats.regionalSales.push({ region, revenue: orderTotal });
  }

  orderStats.averageOrderValue = orderStats.totalRevenue / orderStats.totalOrders;
  orderStats.averageItemsPerOrder = orderStats.totalItemsSold / orderStats.totalOrders;


  orderStats.mostPopularCategory = orderStats.categorySales.reduce((max, cs) => cs.quantitySold > max.quantitySold ? cs : max, orderStats.categorySales[0]).category;

  // await orderStats.save();
  await orderStatsCollection.updateOne(
    {},
    { $set: orderStats },
    { upsert: true }
  );
}

// Controller function to add a new order
// async function addOrder(req, res) {
//   try {
//     const order = req.body; // Assuming order is sent in request body
//     await updateOrderStats(order);
//     res.status(200).send('Order added and statistics updated successfully.');
//   } catch (error) {
//     res.status(500).send('Error adding order and updating statistics.');
//   }
// }

// // Controller function to get order statistics
// async function getOrderStats(req, res) {
//   try {
//     const stats = await OrderStats.findOne();
//     res.status(200).json(stats);
//   } catch (error) {
//     res.status(500).send('Error retrieving order statistics.');
//   }
// }

  

module.exports = { getCheckoutPage, postNewOrder };
