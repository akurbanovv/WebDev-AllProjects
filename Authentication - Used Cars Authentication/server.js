require('dotenv').config()

const express = require("express");
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
//Add sessions
const session = require('express-session');
const passport = require('passport');
const passportLocalMongoose = require('passport-local-mongoose');

//Configure body-parser and set static dir path.
const app = express();
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

//Initialize passport
app.use(session({
    secret: process.env.PASSPORT_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

//Configure Mongoose
mongoose.connect('mongodb://localhost:27017/carDB', {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set("useCreateIndex", true);

const userSchema = new mongoose.Schema(
    {
        username: {
            type: String,
            unique: true,
            require: true,
            minlength: 3
        },
        password: {
            type: String,
            require: true,
            minlength: 5
        },
        fullname: {
            type: String,
            require: true
        },
        profile: String,
        brand: String,
        likes: [
            {
                stock_num: Number,
                make: String,
                model: String,
                color: String,
                year: Number,
                price: Number
            }
        ]
    }
)

userSchema.plugin(passportLocalMongoose)
const User = mongoose.model('User', userSchema)

passport.use(User.createStrategy())
passport.serializeUser(User.serializeUser())
passport.deserializeUser(User.deserializeUser())

app.listen(3000, function () {
    console.log("server started at 3000");
});

app.get('/', function (req, res) {
    res.sendFile(__dirname + "/public/index.html");
});

app.get('/get_current_user', function (req, res) {
    if (req.isAuthenticated()) {
        res.send({
            message: 'success',
            data: req.user
        })
    } else {
        res.send({
            message: "no login",
            data: {}
        })
    }
});

app.get('/register', (req, res) => {
    if (req.query.error) {
        res.redirect("/register.html?error=" + req.query.error);
    } else {
        res.redirect("/register.html");
    }
});

app.post('/register', (req, res) => {

    const newUser = {
        username: req.body.username,
        fullname: req.body.fullname,
        profile: req.body.profile,
        brand: req.body.brand
    }

    console.log(newUser)

    User.register(
        newUser,
        req.body.password,
        function (err) {
            if (err) {
                console.log(err)
                res.redirect('/register?error=' + err)
            } else {
                console.log('user is successfully registered')
                const authenticate = passport.authenticate('local')
                authenticate(req, res, function () {
                    res.redirect('/account?user=' + newUser)
                })
            }
        }
    )
})

app.get("/account", (req, res) => {
    //A page can be viewed only after login
    if (req.isAuthenticated()) {
        res.sendFile(__dirname + "/src/account.html")
    } else {
        res.redirect('/login.html?error=You need to login first!')
    }
});

app.get('/login', (req, res) => {
    if (req.query.error) {
        res.redirect("/login.html?error=" + req.query.error);
    } else {
        res.redirect("/login.html");
    }
});

app.get('/login', (req, res) => {
    if (req.query.error) {
        res.redirect("/login.html?error=" + req.query.error);
    } else {
        res.redirect("/login.html");
    }
});

app.post('/login', (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    })

    req.login(
        user,
        function (err) {
            if (err) {
                console.log(err)
                res.redirect('login?error=Invalid username or password')
            } else {
                const authenticate = passport.authenticate(
                    'local',
                    {
                        successRedirect: '/account',
                        failureRedirect: "/login?error=Username and password don't match"
                    })
                authenticate(req, res)
            }
        }
    )
});

app.get('/logout', (req, res) => {
    req.logout()
    res.redirect('/')
});

app.post('/like_car', (req, res) => {
    if (req.isAuthenticated()) {

        const car = {
            stock_num: req.body.car.stock_num,
            make: req.body.car.make,
            model: req.body.car.model,
            color: req.body.car.color,
            year: req.body.car.year,
            price: req.body.car.price
        }

        User.updateOne(
            {_id: req.user._id, 'likes.stock_num': {$ne: car.stock_num}},
            {
                $push: {likes: car}
            },
            {},
            (err, info) => {
                if (err){
                    res.send({
                        message: "database error"
                    })
                } else {
                    res.send({
                        message: "success"
                    })
                }
            }
        )
    } else { // go to login
        res.send({
            message: "Login required to like a car",
            data: "/login"
        })
    }
});
