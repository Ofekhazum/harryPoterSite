const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;
const path = require('path');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

//connect to the MongoDB
mongoose.connect('mongodb+srv://amitfiller12:amitfiller12@harrypotterstore.zucufr8.mongodb.net/', {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Connected to MongoDB');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Set EJS as the view engine
app.set('view engine', 'ejs');
// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
// Serve static files from 'public' directory
app.use(express.static(path.join(__dirname, 'public')));


app.get('/', (req, res) => {
    res.redirect('index.html');
  });

//start the server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });