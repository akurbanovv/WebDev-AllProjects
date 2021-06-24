function fillCar(car) {
    $('#stock_num').val(car.stock_num)
    $('#make').val(car.make)
    $('#model').val(car.model)
    $('#year').val(car.year)
    $('#color').val(car.color)
    $('#url').val(car.url)
    $('#price').val(car.price)

    if (car.availability === 'available') {
        $("#available").prop("checked", true)
    } else {
        $("#sold").prop("checked", true)
    }
}

const queryString = window.location.search
const urlParams = new URLSearchParams(queryString)

const error_message = urlParams.get("error_message")
const input = JSON.parse(urlParams.get('input'))

if (error_message) {
    let errors = JSON.parse(error_message)
    let error_msg = 'Car validation failed: '

    for (let err in errors) {
        error_msg += err + ": " + errors[err]['message'] + ", "
        $('#'+err).addClass('is-invalid text-danger')
    }

    $('#error_message').text(error_msg.slice(0, -2))
    fillCar(input)
}

const car_id = urlParams.get('car_id')

if (car_id && !error_message) {
    $.getJSON(`/get_car_by_id?car_id=${car_id}`)
        .done((data) => {
            if (data['message'] === 'success') {
                fillCar(data['data'])
            }
        })
}

$('form').on('submit', function () {
    let errorMessage = null
    $.each($('input, select'), function () {
        $(this).removeClass('is-invalid text-danger')

        if (!$(this).val()) {
            $(this).addClass('is-invalid text-danger')
            errorMessage = `${$(this).parent().find('label').text()} cannot be empty`
            return false
        }
    })

    if (errorMessage !== null) {
        $('#error_message').text(errorMessage)
        return false
    }

    if (car_id) {
        $('form').append(() => {
            const input = $('<input>')
                .attr('name', '_id')
                .attr('value', car_id)
            return input
        })
    }
})
