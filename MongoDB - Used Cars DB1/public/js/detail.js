
function load_car(car) {
    $('#car_img').attr('src', car.url)
    $('#stock_number').text(car.stock_num)
    $('#make').text(car.make)
    $('#model').text(car.model)
    $('#year').text(car.year)
    $('#color').text(car.color)
    $('#price').text(car.price)
}

$(document).ready(function () {
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString)
    const car_id = urlParams.get('car_id')

    if (car_id) {
        $.get('/get_car_by_id?car_id=' + car_id).done(
            function (data) {
                if (data["message"] === 'success') {
                    const car = data["data"]
                    load_car(car)
                }
            })

    }

})