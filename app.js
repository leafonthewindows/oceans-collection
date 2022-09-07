//ENV
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config()
}

//REQUIRES
const express = require('express')
const engine = require('ejs-mate')
const mongoose = require('mongoose')
const session = require('express-session');
const MongoStore = require('connect-mongo');
const cookieParser = require('cookie-parser')
const flash = require('connect-flash');
const passport = require('passport')
const LocalStrategy = require('passport-local')
const methodOverride = require('method-override')
const path = require('path');
const bodyParser = require('body-parser')

//EXPRESS
const app = express()
const port = 3000


//EJS
app.engine('ejs', engine)
app.set('view engine', 'ejs')

//MONGOOSE
const dbConnection = process.env.DB_URL;
mongoose.connect(dbConnection, {
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('Mongoose connection open!')
}).catch(err => {
    console.log('Mongoose error!')
    console.log(err)
})

//COOKIE PARSER
app.use(cookieParser(process.env.PARSER_SECRET))

//SESSION & MONGO STORE
app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    store: MongoStore.create({ mongoUrl: process.env.SESSION_URL }),
    cookie: {
        maxAge: 1000 * 60 * 60
    }
}))

//FLASH
app.use(flash())

//PASSPORT
const User = require('./models/user')
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

//ROUTER
const indexRoutes = require('./routes/index')
const galleryRoutes = require('./routes/gallery')

//PATH
app.set('views', path.join(__dirname, 'views'))
app.use(express.static(path.join(__dirname, 'public')))

//BODY PARSING
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(methodOverride('_method'))

//LOCALS
app.use((req, res, next) => {
    res.locals.user = req.user
    res.locals.success = req.flash('success')
    res.locals.error = req.flash('error')
    next()
})

//ROUTES
app.use('/', indexRoutes)
app.use('/gallery', galleryRoutes)

//LISTEN
app.listen(port, () => console.log(`Listening on port ${port}`))
