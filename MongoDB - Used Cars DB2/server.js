const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

mongoose.connect('mongodb://localhost:27017/carDB', {useNewUrlParser: true}, function () {
    console.log("db connection is successful")
})

let cur_year = new Date().getFullYear()

const carSchema = {
    stock_num: {
        type: Number,
        min: [10000, 'Stock number must be at least 5 characters']
    },
    make: String,
    model: String,
    year: {
        type: Number,
        min: [1900, "Year must be between 1900 and 2021"],
        max: [cur_year, "Year must be between 1900 and " + cur_year]
    },
    color: String,
    url: String,
    price: {
        type: Number,
        min: [0, 'Price should be greater than 0'],
        validate: {
            validator: Number.isInteger,
            message: 'Price should an integer value'
        }
    },
    availability: {
        type: String,
        default: 'available'
    }
}

const Car = mongoose.model('Car', carSchema)

app.listen(3000, function () {
    console.log("server started at 3000");
});

app.get('/',
    function (req, res) {
        res.sendFile(__dirname + "/public/index.html");
    });

app.get("/get_all_cars",
    function (req, res) {
        Car.find(function (err, data) {
            if (err) {
                res.send({
                    "message": "internal server error",
                    "data": []
                })
            } else {
                res.send({
                    "message": "success",
                    "data": data
                })
            }
        })
    });

app.get('/get_car_by_id',
    function (req, res) {
        Car.find({"_id": req.query.car_id}, function (err, data) {
            if (err || data.length === 0) {
                res.send({
                    "message": "internal server error",
                    "data": {}
                })
            } else {
                res.send({
                    "message": "success",
                    "data": data[0]
                })
            }
        })
    });

app.get('/get_cars_by_filters', (req, res) => {
    let sk = req.query.search_key

    let min_yr = req.query.min_year
    if (!min_yr) {
        min_yr = 1677
    }

    let max_yr = req.query.max_year
    if (!max_yr) {
        max_yr = 2030
    }

    let min_pr = req.query.min_price
    if (!min_pr) {
        min_pr = 0
    }

    let max_pr = req.query.max_price
    if (!max_pr) {
        max_pr = 999999999
    }

    let available_only = req.query.available_only
    let available_options = ['available', 'sold']
    if (available_only === 'true') {
        available_options = ['available']
    }

    Car.find({
        $and: [
            {year: {$gte: min_yr}},
            {year: {$lte: max_yr}},
            {price: {$gte: min_pr}},
            {price: {$lte: max_pr}},
            {
                $or: [
                    {make: {$regex: sk}},
                    {model: {$regex: sk}}
                ]
            },
            {availability: {$in: available_options}}
        ]
    }, (err, data) => {
        // console.log(err)
        // console.log(data)
        if (err) {
            res.send({
                "message": "db error",
                "data": []
            })
        } else {
            res.send({
                "message": "success",
                "data": data
            })
        }
    })
})

app.post('/delete_car_by_id', ((req, res) => {
    Car.deleteOne(
        {'_id': req.body._id},
        {},
        (err) => {
            if (err) {
                res.send({"message": "database error"})
            } else {
                res.send({"message": "success"})
            }
        }
    )
}))

app.post('/update_car_by_availability', (req, res) => {
    let proper_availability = "available"

    if (req.body.availability === 'available') {
        proper_availability = 'sold'
    }

    Car.updateOne(
        {'_id': req.body._id},
        {
            $set: {availability: proper_availability},

            // initial idea I tried to implement
            // $set: {
            //     availability: {
            //         $switch: {
            //             branches: [
            //                 {case: {$eq: ['$availability', 'available']}, then: 'sold'},
            //                 {case: {$eq: ['$availability', 'sold']}, then: 'available'}
            //             ]
            //         }
            //     }
            // }

        }, function (err) {
            if (err) {
                res.send({"message": "database error"})
            } else {
                res.send({"message": "success"})
            }
        }
    )
})

app.post("/new-car", (req, res) => {
    const car = {
        stock_num: req.body.stock_num,
        make: req.body.make,
        model: req.body.model,
        year: req.body.year,
        color: req.body.color,
        url: req.body.url,
        price: req.body.price,
        availability: req.body.available
    }

    if (req.body._id) {
        Car.updateOne(
            {_id: req.body._id},
            {$set: car},
            {runValidators: true},
            (err, info) => {
                if (err) {
                    console.log(err)
                    res.redirect(`/edit.html?error_message=${JSON.stringify(err.errors)}&input=${JSON.stringify(car)}&car_id=${req.body._id}`)
                } else {
                    console.log(info)
                    res.redirect(`/detail.html?car_id=${req.body._id}`)
                }
            }
        )
    } else {
        const nc = new Car(car)
        nc.save((err, new_car) => {
            if (err) {
                console.log(err["message"]);
                res.redirect("/edit.html?error_message=" + JSON.stringify(err.errors) + "&input=" + JSON.stringify(car))
            } else {
                console.log(new_car._id)
                res.redirect("/detail.html?car_id=" + new_car._id)
            }
        })
    }
})