const express = require("express");
const bodyParser = require('body-parser');
const app = express();
const mongoose = require('mongoose');

app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname + "/public"));

mongoose.connect('mongodb://localhost:27017/carDB', {useNewUrlParser: true}, function () {
    console.log("db connection is successful")
})

const carSchema = {
    stock_num: Number,
    make: String,
    model: String,
    year: Number,
    color: String,
    url: String,
    price: Number
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


