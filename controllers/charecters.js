
const axios = require('axios');


exports.getCharectersPage = async (req, res) => {
    try {
        const charectersIdentidiers = ["9e3f7ce4-b9a7-4244-b709-dae5c1f1d4a8", "4c7e6819-a91a-45b2-a454-f931e4a7cce3", "c3b1f9a5-b87b-48bf-b00d-95b093ea6390", "b415c867-1cff-455e-b194-748662ac2cca", "0d8ea37f-35c4-4c7d-9dd2-8ccd96b0a2b3"]
        
        const charecterPromises = charectersIdentidiers.map(async (charecterId) => {
            const charecter = await getCharecterFromApi(charecterId);
            return charecter;
          });

        let characters = await Promise.all(charecterPromises);

        characters[3].image = "https://static.wikia.nocookie.net/harrypotter/images/4/40/Albus_Dumbledore_%28HBP_promo%29_3.jpg";
        characters[4].image = "https://static.wikia.nocookie.net/harrypotter/images/8/82/Dobby.jpg";
        
        console.log({characters});
        res.render('charecters',{characters, user: req.user});

    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal Server Error');
    }
};


const getCharecterFromApi = async (charecterId) => {

    try {
        const response = await axios.get(`${process.env.POTTERDB_CHARECTERS_API_URL}/${charecterId}`);
        const [charecter] = response.data;
        // console.log({charecter});
        return charecter;

    } catch (error) {
        console.error('Error fetching spells:', error);
        res.status(500).send('Internal Server Error');
    }
};
