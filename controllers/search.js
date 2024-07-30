const { client, dbName } = require('../core/db');


exports.getSearch = async (req, res) => {
    try {
        const {query} = req.query;
        
        const database = client.db(dbName);

        const productsCollection = database.collection('products');

        const products = await productsCollection.find({ item_name: { $regex: query, $options: 'i' } }).toArray();
        
        res.json(products);

    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal Server Error');
    }
};
