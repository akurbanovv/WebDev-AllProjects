const express = require('express')
const app = express()
const fs = require('fs')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({extended: true}))
app.use(express.static(__dirname + "/public"))

let carList = []

app.listen(3000, function () {
    const rawdata = fs.readFileSync(__dirname + "/public/data/data10.json")
    carList = JSON.parse(rawdata)
})

app.get("/", function (
    req, res) {
    res.sendFile(__dirname + "/public/index.html")
})

app.get("/new-car", function (
    req, res) {
    res.sendFile(__dirname + "/public/new_car.html")
})

app.post('/delete-car', function (
    req,
    res) {

    carList = carList.filter(function (car) {
        if (car.stock_num === req.body.id) {
            console.log("Deleted a car with the stock number: " + car.stock_num);
            return false;
        } else {
            return true;
        }
    })

    const carJSON = JSON.stringify(carList);

    fs.unlinkSync(__dirname + "/public/data/data10.json");
    fs.writeFile(__dirname + "/public/data/data10.json",
        carJSON,
        function (err) {
            if (err) {
                console.log("Failed to save JSON file");
            } else {
                res.redirect("/");
            }
        });
})


app.post("/add-car", function (req, res) {
    const carItem = {
        "stock_num": req.body.stock_number,
        "make": req.body.make,
        "model": req.body.model,
        "year": req.body.year,
        "color": req.body.color,
        "url": req.body.url,
        "price": req.body.price
    }

    if (carList.some(car => car.stock_num === req.body.stock_number)) {
        res.redirect("failure.html")
        return false
    }

    carList.push(carItem)

    console.log("Added a car with the stock number: " + req.body.stock_number)
    const carJSON = JSON.stringify(carList);
    fs.writeFile(__dirname + "/public/data/data10.json",
        carJSON,
        function (err) {
            if (err) {
                console.log("Failed to save JSON file");
            } else {
                res.redirect( "success.html")
            }
        });
})
