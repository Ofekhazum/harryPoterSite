
const axios = require('axios');

exports.getSpellsFromApi = async (req, res) => {
    const itemsPerPage = 15;
    const page = parseInt(req.query.page) || 1;

    try {
        const response = await axios.get(`${process.env.POTTERDB_API_URL}`);
        const { data: allSpells } = response.data;

        const spellsWithImages = allSpells.filter(spell => spell.attributes.image);

        const totalSpells = spellsWithImages.length;
        const totalPages = Math.ceil(totalSpells / itemsPerPage);

        const start = (page - 1) * itemsPerPage;
        const end = start + itemsPerPage;
        const spellsOnPage = spellsWithImages.slice(start, end);

        res.render('spells', { 
            spells: spellsOnPage, 
            user: req.user,
            currentPage: page,
            totalPages: totalPages,
        });
    } catch (error) {
        console.error('Error fetching spells:', error);
        res.status(500).send('Internal Server Error');
    }
};
