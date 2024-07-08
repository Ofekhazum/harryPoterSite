const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true
    },
    orderDate: {
        type: Date,
        required: true
    },
    customerId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    shippingAddress: {
        street: String,
        city: String,
        state: String,
        zip: String
    },
    orderTotal: {
        type: Number,
        required: true
    },
    numberOfItems: {
        type: Number,
        required: true
    },
    orderNotes: {
        type: String
    },
    itemIds: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Item'
        }
    ]
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
