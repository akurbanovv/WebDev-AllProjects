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

let cur_year = new Date().getFullYear()

const carSchema = {
    stock_num: {
        type: Number,
        minlength: [5, 'Stock number must be at least 5 characters']
    },
    make: String,
    model: String,
    year: {
        type: Number,
        min: [1900, "Year must be between 1900 and 2021"],
        max: [cur_year, "Year must be between 1900 and "+cur_year]
    },
    color: String,
    url: String,
    price: {
        type: Number,
        min: [0, 'Price should be greater than 0'],
        validate : {
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

Car.insertMany(carList, {}, function (err) {
    if (err) {
        console.log(err)
    } else {
        console.log("All data saved!")
        mongoose.connection.close();
    }
})






