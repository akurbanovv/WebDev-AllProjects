function showList(cars) {
    $('#car_list').empty();

    for (let i = 0; i < cars.length; i++) {
        $('#car_list').append("<div class='row car_item'></div>")
    }

    $('.car_item').attr('value', function (i) {
        return cars[i]._id
    })

    $('.car_item').addClass(function (i) {
        if (i % 2 === 0) {
            return 'even_row';
        } else {
            return 'odd_row';
        }
    })

    $('.car_item').append(function (i) {
        return `<div class="col-2"><a>${cars[i].make}</a></div>`
    }).append(function (i) {
        return `<div class="col-2"><a>${cars[i].model}</a></div>`
    }).append(function (i) {
        return `<div class="col-2"><a>${cars[i].year}</a></div>`
    }).append(function (i) {
        return `<div class="col-2"><a>${cars[i].price}</a></div>`
    }).append(function (i) {
        return `<div class="col-2"><a>${cars[i].availability}</a></div>`
    }).append(function () {
        return `<button type="button" class="col-2 btn btn-outline-primary show_more">Show more</button>`
    })

    $('.show_more').on('click', function () {
        const carID = $(this).parent().attr('value');
        location.href = "detail.html?car_id=" + carID;
    })
}

function showListSorted(sorter) {
    $.get("/get_all_cars").done(
        function (data) {
            if (data.message === "success") {
                let sortedData = data["data"].sort(function (a, b) {
                    if (sorter === 'make') {
                        if (a.make < b.make) {
                            return -1
                        }
                        if (a.make > b.make) {
                            return 1
                        }
                        return 0
                    } else if (sorter === 'model') {
                        if (a.model < b.model) {
                            return -1
                        }
                        if (a.model > b.model) {
                            return 1
                        }
                        return 0
                    } else if (sorter === 'year') {
                        return a.year - b.year
                    } else if (sorter === 'price') {
                        return a.price - b.price
                    } else if (sorter === 'availability') {
                        if (a.availability < b.availability) {
                            return -1
                        }
                        if (a.availability > b.availability) {
                            return 1
                        }
                        return 0
                    }
                })
                showList(sortedData)
            }
        })
}

$('#make_title').on('click', function () {
    showListSorted('make')
})

$('#model_title').on('click', function () {
    showListSorted('model')

})

$('#year_title').on('click', function () {
    showListSorted('year')
})

$('#price_title').on('click', function () {
    showListSorted('price')
})

$('#availability_title').on('click', function () {
    showListSorted('availability')
})


$.get("/get_all_cars").done(
    function (data) {
        if (data.message === "success") {
            showList(data["data"]);
        }
    });

function searchCar() {
    $.get('/get_cars_by_filters', {
        search_key: $('#search_box').val(),
        min_year: $('#min_year').val(),
        max_year: $('#max_year').val(),
        min_price: $('#min_price').val(),
        max_price: $('#max_price').val(),
        available_only: $('#show_available').is(":checked")

    }).done((data) => {
        if (data.message === "success") {
            showList(data.data)
        }
    })
}

function addNewCar(){
    location.href = "edit.html"
}
