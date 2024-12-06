const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const passport = require('passport');
const LocalStrategy = require('passport-local');
const methodOverride = require('method-override');
const User = require('./models/user');
const Warehouse = require('./models/warehouse');

mongoose.connect('mongodb://localhost:27017/practicehub');

const db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error:"));
db.once("open", () => {
    console.log("Database connected");
});

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({ extended: true }));
app.use(methodOverride('_method'));
app.use(session({
    secret: 'yourSecretKey',
    resave: false,
    saveUninitialized: false,
    cookie: { secure: false } 
}));

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use((req, res, next) => {
    res.locals.currentUser = req.user;
    next();
});

const isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        return res.redirect('/login');
    }
    next();
};

const isAuthor = async (req, res, next) => {
    const { id } = req.params;
    const warehouse = await Warehouse.findById(id);
    if (!warehouse.author.equals(req.user._id)) {
        return res.redirect(`/warehouses/${id}`);
    }
    next();
};

app.get('/', (req, res) => {
    res.render('home');
});

app.get('/register', (req, res) => {
    res.render('warehouses/register');
});

app.post('/register', async (req, res) => {
    try {
        const { email, username, password } = req.body;
        const user = new User({ email, username });
        const registeredUser = await User.register(user, password);
        req.login(registeredUser, err => {
            if (err) return next(err);
            res.redirect('/warehouses');
        });
    } catch (e) {
        console.log(e);
        res.redirect('register');
    }
});

app.get('/login', (req, res) => {
    res.render('warehouses/login');
});

app.post('/login', passport.authenticate('local', { 
    failureRedirect: '/login'
}), (req, res) => {
    const redirectUrl = req.session.returnTo || '/warehouses';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
});

app.get('/logout', (req, res, next) => {
    req.logout((err) => {
        if (err) return next(err);
        res.redirect('/');
    });
});

app.get('/warehouses', async (req, res) => {
    const warehouses = await Warehouse.find({});
    res.render('warehouses/index', { warehouses });
});

app.get('/warehouses/new', isLoggedIn, (req, res) => {
    res.render('warehouses/new');
});

app.post('/warehouses', isLoggedIn, async (req, res) => {
    const warehouse = new Warehouse(req.body.warehouse);
    warehouse.author = req.user._id;
    await warehouse.save();
    res.redirect(`/warehouses/${warehouse._id}`);
});

app.get('/warehouses/:id', async (req, res) => {
    try {
        const warehouse = await Warehouse.findById(req.params.id).populate('author');
        res.render('warehouses/show', { warehouse, currentUser: req.user });
    } catch (error) {
        console.error(error);
        res.status(500).send('Server error');
    }
});

app.get('/warehouses/:id/edit', isLoggedIn, isAuthor, async (req, res) => {
    const warehouse = await Warehouse.findById(req.params.id);
    res.render('warehouses/edit', { warehouse });
});

app.put('/warehouses/:id', isLoggedIn, isAuthor, async (req, res) => {
    const { id } = req.params;
    const warehouse = await Warehouse.findByIdAndUpdate(id, req.body.warehouse, { new: true });
    res.redirect(`/warehouses/${warehouse._id}`);
});

app.delete('/warehouses/:id', isLoggedIn, isAuthor, async (req, res) => {
    const { id } = req.params;
    await Warehouse.findByIdAndDelete(id);
    res.redirect('/warehouses');
});

app.get('/products', (req, res) => {
    res.render('warehouses/products');
});
app.get('/chathub', (req, res) => {
    res.render('warehouses/chathub');
});
app.get('/digital', (req, res) => {
    res.render('warehouses/digital');
});
app.get('/innovation', (req, res) => {
    res.render('warehouses/innovation');
});

app.listen(3000, () => {
    console.log('Serving on port 3000');
});


