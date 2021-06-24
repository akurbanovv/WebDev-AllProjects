const mongoose = require('mongoose')
const parse = require('csv-parse/lib/sync')
const fs = require('fs');

const rawdata = fs.readFileSync(__dirname + '/data100.csv')
const carList = parse(rawdata, {
    columns: true,
    skip_empty_lines: true
})

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

Car.insertMany(carList, {},function (err){
    if (err){
        console.log(err)
    } else {
        console.log("All data saved!")
        mongoose.connection.close();
    }
})




