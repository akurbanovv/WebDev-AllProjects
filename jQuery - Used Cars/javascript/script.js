console.log(cars);

cars.sort(function (a, b) {
    return b.year - a.year;
})

for (let i = 0; i < cars.length; i++) {
    $('#car_grid').append('<li class="list-group-item col-sm-12 col-md-6 col-lg-4 col-xl-3"></li>')
}

$('#car_grid li')
    .append('<div class="card""></div>')
    .css('border', '0px')

$('#car_grid .card')
    .append('<img class="card-img-top"/>')
    .append('<div class="card-body"></div')
    .append('<div class="btn-group" role="group"></div>')

$('#car_grid .card-img-top').attr('src', function (inx) {
    return cars[inx].url
})

for (let i = 0; i < cars.length; i++) {
    let table = "<table class='card_table'>"
    table +=
        `<tr>
            <td style="width:5em">Maker:</td>
            <td class="make">${cars[i].make}</td>
        </tr>
        <tr>
            <td style="width:5em">Model:</td>
            <td class="model">${cars[i].model}</td>
        </tr>
        <tr>
            <td style="width:5em">Year:</td>
            <td class="year">${cars[i].year}</td>
        </tr>
        <tr>
            <td style="width:5em">Price:</td>
            <td class="price">${cars[i].price}</td>
        </tr>`
    table += '</table>'

    $('#car_grid .card-body').eq(i).append(table)
}

$('tr').css('font-size', 'large')


$('#car_grid .card-body').addClass(function (idx) {
    if (idx % 2 === 0) {
        return 'even_row';
    } else {
        return 'odd_row';
    }
});

$('#car_grid .btn-group').append(
    '<button type="button" class="like_button btn btn-secondary"><i class="fas fa-thumbs-up"></i></button>' +
    '<button type="button" class="dislike_button btn btn-secondary"><i class="fas fa-thumbs-down"></i></button>' +
    '<button type="button" class="delete_button btn btn-danger"><i class="fas fa-trash-alt"></i></i></button>'
)

$('.like_button').on('click', function () {
    if ($(this).css('background-color') !== 'rgb(255, 165, 0)') {
        $(this).css('background-color', 'orange')
        $(this).parents('li').addClass('liked')
    } else {
        $(this).css('background-color', '')
        $(this).parents('li').removeClass('liked')
    }

})

$('.dislike_button').on('click', function () {
    if ($(this).css('background-color') !== 'rgb(255, 165, 0)') {
        $(this).css('background-color', 'orange')
        $(this).parents('li').addClass('unlike')
    } else {
        $(this).css('background-color', '')
        $(this).parents('li').removeClass('unlike')
    }
})

$('.delete_button').on('click', function () {
    const row = $(this).parents('li').fadeOut(1000, function () {
        $(this).remove().finish()
        update_make_list()
    })
})


function update_cars() {
    const currentInput = $('#search_box').val().toLowerCase();

    $.each($('#car_grid li'), function () {

        const make = $(this).find('.make').text().toLowerCase();
        const model = $(this).find('.model').text().toLowerCase();
        const year = $(this).find('.year').text().toLowerCase();

        const containsWord =
            make.includes(currentInput) ||
            model.includes(currentInput) ||
            year.includes(currentInput)

        if ($('#all_cars').is(':checked')) {

            if (containsWord) {
                $(this).show(500)
            } else {
                $(this).hide(500)
            }

        } else if ($('#all_likes').is(':checked')) {

            if ($(this).attr('class').includes('liked') && containsWord) {
                $(this).show(500)
            } else {
                $(this).hide(500)
            }

        } else if ($('#all_dislikes').is(':checked')) {

            if ($(this).attr('class').includes('unlike') && containsWord) {
                $(this).show(500)
            } else {
                $(this).hide(500)
            }

        }
    })
}

$('#search_box').on('keyup', function () {
    update_cars('sbox')
});


update_make_list()

function update_make_list() {
    $('#make_list').empty();

    let make_list = []

    $.each($('.card_table'), function () {
        let make = $(this).find('td').eq(1).text()

        if (!make_list.includes(make)) {
            make_list.push(make)
            $('#make_list')
                .append(`<li class="list-group-item">${make}</li>`)
                .css('font-size', 'large')
        }
    })
}








