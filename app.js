// Load environment variables for non-production
if (process.env.NODE_ENV !== "production") {
    require('dotenv').config();
}

// Required dependencies
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const ejsMate = require('ejs-mate');
const session = require('express-session');
const flash = require('connect-flash');
const methodOverride = require('method-override');
const mongoSanitize = require('express-mongo-sanitize');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const MongoDBStore = require('connect-mongo');
const ExpressError = require('./utils/ExpressError');
const User = require('./models/user');

// Route imports
const warehouseRoutes = require('./routes/warehouses');
const userRoutes = require('./routes/users');
const productsRoutes = require('./routes/product');
const chathubRoutes = require('./routes/chathub');
const foodsecurityRoutes = require('./routes/foodsecurity');
const labourRoutes = require('./routes/labours');

// Initialize Express app
const app = express();

// MongoDB Atlas connection URI
const dbUrl = process.env.MONGO_URI || 'mongodb://localhost:27017/FarmersHub';

mongoose.connect(dbUrl, {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

const db = mongoose.connection;
db.on('error', console.error.bind(console, '❌ MongoDB connection error:'));
db.once('open', () => {
    console.log('✅ MongoDB database connected');
});

// View engine setup
app.engine('ejs', ejsMate);
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(mongoSanitize({ replaceWith: '_' }));

// Session configuration
const secret = process.env.SECRET || 'thisshouldbeabettersecret!';
const store = MongoDBStore.create({
    mongoUrl: dbUrl,
    secret,
    touchAfter: 24 * 60 * 60 // lazy session update
});

store.on('error', function (e) {
    console.log('❌ SESSION STORE ERROR:', e);
});

const sessionConfig = {
    store,
    name: 'session',
    secret,
    resave: false,
    saveUninitialized: true,
    cookie: {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        expires: Date.now() + 1000 * 60 * 60 * 24 * 7, // 7 days
        maxAge: 1000 * 60 * 60 * 24 * 7
    }
};
app.use(session(sessionConfig));
app.use(flash());

// Passport authentication
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

// Flash + user middleware
app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    next();
});

// Routes
app.use('/', userRoutes);
app.use('/warehouses', warehouseRoutes);
app.use('/foodsecurity', foodsecurityRoutes);
app.use('/products', productsRoutes);
app.use('/chathub', chathubRoutes);
app.use('/labours', labourRoutes);

// Static pages
app.get('/', (req, res) => {
    res.render('home');
});
app.get('/quality', (req, res) => {
    res.render('quality');
});
app.get('/digital', (req, res) => {
    res.render("digital/index");
});
app.get('/awareness', (req, res) => {
    res.render("awareness/index");
});

// Catch-all for 404s
app.all('*', (req, res, next) => {
    next(new ExpressError('Page Not Found', 404));
});

// Global error handler
app.use((err, req, res, next) => {
    const { statusCode = 500 } = err;
    if (!err.message) err.message = 'Something went wrong!';
    res.status(statusCode).render('error', { err });
});

// Start server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`🚀 Server running on port ${port}`);
});
