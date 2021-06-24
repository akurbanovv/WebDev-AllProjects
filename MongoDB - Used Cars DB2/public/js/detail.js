let car

function load_car(car) {
    $('#car_img').attr('src', car.url)
    $('#stock_number').text(car.stock_num)
    $('#make').text(car.make)
    $('#model').text(car.model)
    $('#year').text(car.year)
    $('#color').text(car.color)
    $('#price').text(car.price)
    $('#availability').text(capitalize(car.availability))
    $('#mark_button').text('Mark as ' + switchh(car.availability))
}

const capitalize = (s) => {
    return s.charAt(0).toUpperCase() + s.slice(1)
}

const switchh = (input) => {
    switch (input) {
        case 'available':
            return 'sold'
        case 'sold':
            return 'available'

    }
}

$(document).ready(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    const car_id = urlParams.get('car_id')

    if (car_id) {
        $.get('/get_car_by_id?car_id=' + car_id).done(
            function (data) {
                if (data["message"] === 'success') {
                    car = data["data"]
                    load_car(car)
                }
            })
    }
})

function onEdit() {
    location.href = "/edit.html?car_id=" + car._id
}

function onMark() {
    $.post('/update_car_by_availability', {_id: car._id, availability: car.availability})
        .done((msg) => {
            if (msg.message === 'success') {
                location.reload()
            }
        })
}

function onDelete() {
    $.post('/delete_car_by_id', {_id: car._id})
        .done((msg) => {
            if (msg.message === 'success') {
                location.href = '/index.html'
            }
        })
}