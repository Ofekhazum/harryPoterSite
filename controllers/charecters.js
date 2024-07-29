const { client, dbName } = require('../core/db');
const {extractSubArray} = require('../core/util')
const {getProductsWishlist} = require('../controllers/product');


exports.getCharectersPage = async (req, res) => {
    try {
        res.render('charecters',{});

    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal Server Error');
    }
};
