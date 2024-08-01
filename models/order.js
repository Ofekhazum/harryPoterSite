const mongoose = require('mongoose');
const { Schema } = mongoose;

const orderSchema = new Schema({
  orderId: {
    type: String,
    required: true,
    unique: true,
  },
  orderDate: {
    type: Date,
    default: Date.now,
  },
  customerId: {
    type: String,
    required: true,
  },
  shippingAddress: {
    street: String,
    city: String,
    zip: String,
    phone: String,
    country: String,
  },
  orderTotal: {
    type: Number,
    required: true,
  },
  numberOfItems: {
    type: Number,
    required: true,
  },
  orderNotes: String,
  itemIds: [
    {
      productId: {
        type: String,
        required: true,
      },
      quantity: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
