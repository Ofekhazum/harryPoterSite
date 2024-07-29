
const { client, dbName } = require('../core/db');
const mongoose = require('mongoose');


const getCollection = (collectionName) => {
    const database = client.db(dbName);
    return database.collection(`${collectionName}`);
}

const getStatsDocument = async () => {
    return await getCollection("orderStats").findOne();
}

const getTotalRevenue = async () => {
    const orderStats = await getStatsDocument();
    return orderStats ? orderStats.totalRevenue : 0;
};

const getTotalOrders = async () => {
    const orderStats = await getStatsDocument();
  return orderStats ? orderStats.totalOrders : 0;
};

const getTotalItemsSold = async () => {
    const orderStats = await getStatsDocument();
  return orderStats ? orderStats.totalItemsSold : 0;
};

const getTopProducts = async (limit = 10) => {
    const orderStats = await getStatsDocument();
    if (orderStats) {
      const topProductSales = orderStats.productSales
        .sort((a, b) => b.quantitySold - a.quantitySold)
        .slice(0, limit);
  
      const productIds = topProductSales.map(ps => new mongoose.Types.ObjectId(ps.productId));
      const database = client.db(dbName);
      const productsCollection = database.collection('products');
      const products = await productsCollection.find({ _id: { $in: productIds } }).toArray();
  
      const topProducts = topProductSales.map(ps => {
        const product = products.find(p => p._id.toString() === ps.productId);
        return {
          ...ps,
          product: product ? product : null,
        };
      });
  
      return topProducts;
    }
    return [];
  };


const getTopCategories = async (limit = 10) => {
    const orderStats = await getStatsDocument();
  if (orderStats) {
    return orderStats.categorySales
      .sort((a, b) => b.quantitySold - a.quantitySold)
      .slice(0, limit);
  }
  return [];
};

module.exports = {
  getTotalRevenue,
  getTotalOrders,
  getTotalItemsSold,
  getTopProducts,
  getTopCategories
};
