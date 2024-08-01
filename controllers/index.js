const { client, dbName } = require('../core/db');
const {extractSubArray} = require('../core/util')
const {getProductsWishlist} = require('../controllers/product');

exports.getIndex = (req, res) => {
    res.render('index');
};

exports.getHomePage = async (req, res) => {
    try {
        const database = client.db(dbName);

        const products = database.collection('products');

        const cursorProducts = products.find();

        const allProducts = await cursorProducts.toArray();

        const bestSellers = extractSubArray(allProducts, 0, 4);

        const newIn = extractSubArray(allProducts, 8, 4);

        const wishlist = req.session.wishlist || [];

        const wishlistProducts = await getProductsWishlist(wishlist);

        res.render('index', { bestSellers,newIn, user: req.user, wishlist: wishlistProducts });


    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal Server Error');
    }
};
