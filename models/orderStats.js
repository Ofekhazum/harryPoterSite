
const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderStatsSchema = new Schema({
  totalRevenue: {
    type: Number,
    default: 0,
  },
  totalOrders: {
    type: Number,
    default: 0,
  },
  totalItemsSold: {
    type: Number,
    default: 0,
  },
  productSales: [
    {
      productId: String,
      productName: String,
      quantitySold: Number,
      totalRevenue: Number,
    },
  ],
  categorySales: [
    {
      category: String,
      quantitySold: Number,
      totalRevenue: Number,
    },
  ],
  dailyRevenue: [
    {
      date: {
        type: Date,
        required: true,
        unique: true
      },
      revenue: {
        type: Number,
        required: true
      }
    },
  ],
  monthlyRevenue: [
    {
      month: {
        type: String,
        required: true,
        unique: true // e.g., "2024-07"
      },
      revenue: {
        type: Number,
        required: true
      }
    },
  ],
  yearlyRevenue: [
    {
      year: {
        type: Number,
        required: true,
        unique: true
      },
      revenue: {
        type: Number,
        required: true
      }
    },
  ],
  averageOrderValue: {
    type: Number,
    default: 0,
  },
  averageItemsPerOrder: {
    type: Number,
    default: 0,
  },
  mostPopularCategory: {
    type: String,
    default: '',
  },
  regionalSales: [
    {
      region: {
        type: String,
        required: true,
        unique: true
      },
      revenue: {
        type: Number,
        required: true
      }
    },
  ],
});

const OrderStats = mongoose.model('OrderStats', orderStatsSchema);

module.exports = OrderStats;
