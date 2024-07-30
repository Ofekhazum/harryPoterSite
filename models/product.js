// models/product.js
const mongoose = require('mongoose');
const { Schema } = mongoose;

const productSchema = new Schema({
  item_id: {
    type: String,
    required: true
  },
  item_name: {
    type: String,
    required: true
  },
  item_description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  subcategory: {
    type: Schema.Types.Mixed,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity_in_stock: {
    type: Number,
    required: true
  },
  image_url: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Product', productSchema);
