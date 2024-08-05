// /1. ייבוא ספריות ומודולים/ 
const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const session = require('express-session');
const passport = require('passport');
const flash = require('connect-flash');
const dotenv = require('dotenv');
const MongoStore = require('connect-mongo');

const { connectToDatabase, serverURI } = require('./core/db');
const { attachUser, fetchWishlist } = require('./middleware/auth');

// 2. ייבוא קבצי נתיבים (Routes)
const authRoutes = require('./routes/auth');
const indexRoutes = require('./routes/index');
const productRoutes = require('./routes/product');
const profileRoutes = require('./routes/profile');
const inventoryRoutes = require('./routes/inventory');
const usersManagementRoutes = require('./routes/usersManagement');
const wishlistRoutes = require('./routes/wishlist');
const cartRoutes = require('./routes/cart');
const checkoutRoutes = require('./routes/checkout');
const orderStatsRoutes = require('./routes/orderStats');
const charectersRoutes = require('./routes/charecters');
const searchRoutes = require('./routes/search');
const aboutUsRoutes = require('./routes/aboutUs');
const spellsRoutes = require('./routes/spells');



dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;

connectToDatabase();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use(session({
    secret: `${process.env.HASH_SECERET_KEY}`,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({ mongoUrl: serverURI }),
    cookie: {
      maxAge: 1000 * 60 * 60 * 24 // 1 day
    }
}));
require('./middleware/passport')(passport);
app.use(passport.initialize());
app.use(passport.session());
app.use(flash());

app.use(attachUser); 

app.use(fetchWishlist);

app.use(express.static(path.join(__dirname, 'public')));
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(authRoutes);
app.use(indexRoutes);
app.use(productRoutes);
app.use(profileRoutes);
app.use(inventoryRoutes);
app.use(usersManagementRoutes);
app.use(wishlistRoutes);
app.use(cartRoutes);
app.use(checkoutRoutes);
app.use(orderStatsRoutes);
app.use(charectersRoutes);
app.use(searchRoutes);
app.use(aboutUsRoutes);
app.use(spellsRoutes);



app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
