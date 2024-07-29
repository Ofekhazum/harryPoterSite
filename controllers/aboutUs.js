
exports.getAboutUsPage = async (req, res) => {
    try {
        res.render('about-us', {  user: req.user });
    } catch (err) {
        console.error('Error fetching data:', err);
        res.status(500).send('Internal Server Error');
    }
};
